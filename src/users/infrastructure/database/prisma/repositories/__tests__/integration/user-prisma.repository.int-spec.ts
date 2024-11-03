import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';

import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository';

describe('UserPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
  });

  beforeEach(async () => {
    sut = new UserPrismaRepository(prismaService as any);
    await prismaService.user.deleteMany();
  });

  it('deve disparar um erro quando a entidade não for encontrada', async () => {
    await expect(() => sut.findById('fakeId')).rejects.toThrow(
      new NotFoundError('UserModel não encontrado usando id fakeId'),
    );
  });

  it('deve encontrar uma entidade por id', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    const newUser = await prismaService.user.create({ data: entity.toJSON() });
    const output = await sut.findById(newUser.id);

    expect(output.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('deve inserir um nova entidade', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await sut.insert(entity);
    const result = await prismaService.user.findUnique({ where: { id: entity._id } });

    expect(result).toStrictEqual(entity.toJSON());
  });

  it('deve retornar todos usuários', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({ data: entity.toJSON() });
    const entities = await sut.findAll();

    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
    entities.map((item) => expect(item.toJSON()).toStrictEqual(entity.toJSON()));
  });

  it('deve disparar um erro na atualização quando a entidade não for encontrada', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await expect(() => sut.update(entity)).rejects.toThrow(
      new NotFoundError(`UserModel não encontrado usando id ${entity._id}`),
    );
  });

  it('deve atualizar uma entidade', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({ data: entity.toJSON() });
    entity.update('Novo nome');
    await sut.update(entity);

    const output = await prismaService.user.findUnique({ where: { id: entity._id } });

    expect(output.name).toBe('Novo nome');
  });

  it('deve disparar um erro na deleção quando a entidade não for encontrada', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await expect(() => sut.delete(entity._id)).rejects.toThrow(
      new NotFoundError(`UserModel não encontrado usando id ${entity._id}`),
    );
  });

  it('deve apagar uma entidade', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({ data: entity.toJSON() });
    await sut.delete(entity._id);

    const output = await prismaService.user.findUnique({ where: { id: entity._id } });

    expect(output).toBeNull();
  });

  it('deve disparar um erro se a entidade não for encontrada', async () => {
    await expect(() => sut.findByEmail('a@a.com')).rejects.toThrow(
      new NotFoundError(`UserModel não encontrado usando email a@a.com`),
    );
  });

  it('deve encontrar uma entidade por email', async () => {
    const entity = new UserEntity(UserDataBuilder({ email: 'a@a.com' }));
    await prismaService.user.create({ data: entity.toJSON() });
    const output = await sut.findByEmail('a@a.com');

    expect(output.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('deve disparar um erro se a entidade não for encontrada por email', async () => {
    const entity = new UserEntity(UserDataBuilder({ email: 'a@a.com' }));
    await prismaService.user.create({ data: entity.toJSON() });

    await expect(() => sut.emailExists('a@a.com')).rejects.toThrow(
      new NotFoundError(`Endereço de e-mail já cadastrado`),
    );
  });

  it('não deve encontrar uma entidade por email', async () => {
    expect.assertions(0);
    await sut.emailExists('a@a.com');
  });

  describe('search method tests', () => {
    it('deve aplicar paginação quando parâmetros forem nulos', async () => {
      const createdAt = new Date();
      const entities: UserEntity[] = [];
      const arrange = Array(16).fill(UserDataBuilder({}));

      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...element,
            name: `User${index}`,
            email: `test${index}@mail.com`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await prismaService.user.createMany({
        data: entities.map((item) => item.toJSON()),
      });

      const searchOutput = await sut.search(new UserRepository.SearchParams({}));
      const items = searchOutput.items;
      // console.log(searchOutput);

      expect(searchOutput).toBeInstanceOf(UserRepository.SearchResult);
      expect(searchOutput.items).toHaveLength(15);
      expect(searchOutput.total).toBe(16);

      searchOutput.items.forEach((item) => expect(item).toBeInstanceOf(UserEntity));

      items
        .reverse()
        .forEach((item, index) => expect(`test${index + 1}@mail.com`).toBe(item.email));
    });

    it('deve pesquisar usando filtro, ordenação e paginação', async () => {
      const createdAt = new Date();
      const entities: UserEntity[] = [];
      const arrange = ['test', 'a', 'TEST', 'b', 'TeSt'];

      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...UserDataBuilder({ name: element }),
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await prismaService.user.createMany({
        data: entities.map((item) => item.toJSON()),
      });

      const searchOutput1 = await sut.search(
        new UserRepository.SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutput1.items[0].toJSON()).toMatchObject(entities[0].toJSON());
      expect(searchOutput1.items[1].toJSON()).toMatchObject(entities[4].toJSON());

      const searchOutput2 = await sut.search(
        new UserRepository.SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutput2.items[0].toJSON()).toMatchObject(entities[2].toJSON());
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';

import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';
import { HashProdider } from '@/shared/application/providers/hash-prodider';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { SigninUseCase } from '@/users/application/usecases/signin.usecase';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';

describe('SigninUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: UserPrismaRepository;
  let module: TestingModule;
  let hashProdider: HashProdider;
  let sut: SigninUseCase.UseCase;

  beforeAll(async () => {
    setupPrismaTests();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new UserPrismaRepository(prismaService as any);
    hashProdider = new BcryptjsHashProvider();
  });

  beforeEach(async () => {
    sut = new SigninUseCase.UseCase(repository, hashProdider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('não deve poder se autenticar com email invalido', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await expect(() =>
      sut.execute({
        email: entity.email,
        password: 'fakePassword',
      }),
    ).rejects.toThrow(
      new NotFoundError(`UserModel não encontrado usando email ${entity.email}`),
    );
  });

  it('não deve poder se autenticar com senha invalida', async () => {
    const hashPassword = await hashProdider.generateHash('123456');
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    );
    await prismaService.user.create({ data: entity.toJSON() });

    await expect(() =>
      sut.execute({
        email: 'a@a.com',
        password: 'fakePassword',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('não deve poder se autenticar com email não informado', async () => {
    await expect(() =>
      sut.execute({
        email: null,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('não deve poder se autenticar com senha não informada', async () => {
    await expect(() =>
      sut.execute({
        email: 'a@a.com',
        password: null,
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('deve autenticar o usuário', async () => {
    const hashPassword = await hashProdider.generateHash('123456');
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    );
    await prismaService.user.create({ data: entity.toJSON() });

    const output = await sut.execute({
      email: 'a@a.com',
      password: '123456',
    });

    expect(output).toMatchObject(entity.toJSON());
  });
});

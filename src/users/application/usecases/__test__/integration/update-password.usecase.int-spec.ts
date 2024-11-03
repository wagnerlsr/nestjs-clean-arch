import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';

import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';
import { HashProdider } from '@/shared/application/providers/hash-prodider';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UpdatePasswordUsecase } from '@/users/application/usecases/update-password.usecase';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';

describe('UpdatePasswordUsecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: UserPrismaRepository;
  let module: TestingModule;
  let hashProdider: HashProdider;
  let sut: UpdatePasswordUsecase.UseCase;

  beforeAll(async () => {
    setupPrismaTests();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new UserPrismaRepository(prismaService as any);
    hashProdider = new BcryptjsHashProvider();
  });

  beforeEach(async () => {
    sut = new UpdatePasswordUsecase.UseCase(repository, hashProdider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('deve disparar um erro se a entidade não for encontrada por email', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: 'OldPassword',
        password: 'NewPassword',
      }),
    ).rejects.toThrow(
      new NotFoundError(`UserModel não encontrado usando id ${entity._id}`),
    );
  });

  it('deve disparar um erro quando a senha antiga não for passada', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({ data: entity.toJSON() });

    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: '',
        password: 'NewPassword',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('A nova senha e a antiga devem ser informadas'),
    );
  });

  it('deve disparar um erro quando a nova senha não for passada', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({ data: entity.toJSON() });

    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: 'OldPassword',
        password: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('A nova senha e a antiga devem ser informadas'),
    );
  });

  it('deve atualizar a senha', async () => {
    const oldPassword = await hashProdider.generateHash('123456');
    const entity = new UserEntity(UserDataBuilder({ password: oldPassword }));
    await prismaService.user.create({ data: entity.toJSON() });

    const output = await sut.execute({
      id: entity._id,
      oldPassword: '123456',
      password: '654321',
    });

    const result = await hashProdider.compareHash('654321', output.password);

    expect(result).toBeTruthy();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';

import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { DeleteUserUsecase } from '@/users/application/usecases/delete-user.usecase';
import { GetUserUsecase } from '@/users/application/usecases/get-user.usecase';
import { UpdateUserUsecase } from '@/users/application/usecases/update-user.usecase';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository';

describe('UpdateUserUsecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: UserPrismaRepository;
  let module: TestingModule;
  let sut: UpdateUserUsecase.UseCase;

  beforeAll(async () => {
    setupPrismaTests();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new UserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new UpdateUserUsecase.UseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('deve disparar um erro quando usuário não encontrado', async () => {
    await expect(() => sut.execute({ id: 'fakeId', name: 'fakeName' })).rejects.toThrow(
      new NotFoundError(`UserModel não encontrado usando id fakeId`),
    );
  });

  it('deve atualizar um usuário', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    const model = await prismaService.user.create({ data: entity.toJSON() });
    const output = await sut.execute({ id: entity._id, name: 'new name' });

    expect(output.name).toBe('new name');
  });
});

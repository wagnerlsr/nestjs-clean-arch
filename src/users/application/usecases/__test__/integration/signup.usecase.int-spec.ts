import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';

import { HashProdider } from '@/shared/application/providers/hash-prodider';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { SignupUseCase } from '@/users/application/usecases/signup.usecase';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';

describe('SignupUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: UserPrismaRepository;
  let module: TestingModule;
  let hashProdider: HashProdider;
  let sut: SignupUseCase.UseCase;

  beforeAll(async () => {
    setupPrismaTests();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new UserPrismaRepository(prismaService as any);
    hashProdider = new BcryptjsHashProvider();
  });

  beforeEach(async () => {
    sut = new SignupUseCase.UseCase(repository, hashProdider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('deve criar um usuário', async () => {
    const props = { name: 'test name', email: 'a@a.com', password: '123456' };
    const output = await sut.execute(props);

    expect(output.id).toBeDefined();
    expect(output.createdAt).toBeInstanceOf(Date);
  });
});

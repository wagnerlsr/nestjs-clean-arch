import { PrismaClient, User } from '@prisma/client';

import { ValidationError } from '@/shared/domain/errors/validation-error';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserModelMapper } from '@/users/infrastructure/database/prisma/models/user-model.mapper';

describe('UserModelMapper integration tests', () => {
  let prismaService: PrismaClient;
  let props: any;

  beforeAll(async () => {
    setupPrismaTests();
    prismaService = new PrismaClient();
    await prismaService.$connect();
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();

    props = {
      id: '4ad9f03e-bdc4-4a88-a549-695ce702945a',
      name: 'Test name',
      email: 'test@test.com',
      password: '123456',
      createdAt: new Date(),
    };
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('deve disparar um erro quando user model for invalido', () => {
    const model: User = Object.assign(props, { name: null });
    expect(() => UserModelMapper.toEntity(model)).toThrowError(ValidationError);
  });

  it('deve converter user model para um user entity', async () => {
    const model: User = await prismaService.user.create({ data: props });
    const sut = UserModelMapper.toEntity(model);

    expect(sut).toBeInstanceOf(UserEntity);
    expect(sut.toJSON()).toStrictEqual(props);
  });
});

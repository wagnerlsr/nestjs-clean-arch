import { Module } from '@nestjs/common';

import { HashProdider } from '@/shared/application/providers/hash-prodider';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { DeleteUserUsecase } from '@/users/application/usecases/delete-user.usecase';
import { GetUserUsecase } from '@/users/application/usecases/get-user.usecase';
import { ListUsersUsecase } from '@/users/application/usecases/list-users.usecase';
import { SigninUseCase } from '@/users/application/usecases/signin.usecase';
import { SignupUseCase } from '@/users/application/usecases/signup.usecase';
import { UpdatePasswordUsecase } from '@/users/application/usecases/update-password.usecase';
import { UpdateUserUsecase } from '@/users/application/usecases/update-user.usecase';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';

import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'UserRepository',
      useFactory: (prismaService: PrismaService) =>
        new UserPrismaRepository(prismaService),
      inject: ['PrismaService'],
    },
    // {
    //   provide: 'UserRepository',
    //   useClass: UserInMemoryRepository,
    // },
    {
      provide: 'HashProvider',
      useClass: BcryptjsHashProvider,
    },
    {
      provide: SignupUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProdider: HashProdider,
      ) => new SignupUseCase.UseCase(userRepository, hashProdider),
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: SigninUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProdider: HashProdider,
      ) => new SigninUseCase.UseCase(userRepository, hashProdider),
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: GetUserUsecase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) =>
        new GetUserUsecase.UseCase(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: ListUsersUsecase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) =>
        new ListUsersUsecase.UseCase(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserUsecase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) =>
        new UpdateUserUsecase.UseCase(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: UpdatePasswordUsecase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProdider: HashProdider,
      ) => new UpdatePasswordUsecase.UseCase(userRepository, hashProdider),
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: DeleteUserUsecase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) =>
        new DeleteUserUsecase.UseCase(userRepository),
      inject: ['UserRepository'],
    },
  ],
})
export class UsersModule {}

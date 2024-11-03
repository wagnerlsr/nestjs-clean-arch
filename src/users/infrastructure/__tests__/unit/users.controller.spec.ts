import { UserOutput } from '@/users/application/dtos/user-output';
import { DeleteUserUsecase } from '@/users/application/usecases/delete-user.usecase';
import { GetUserUsecase } from '@/users/application/usecases/get-user.usecase';
import { ListUsersUsecase } from '@/users/application/usecases/list-users.usecase';
import { SigninUseCase } from '@/users/application/usecases/signin.usecase';
import { SignupUseCase } from '@/users/application/usecases/signup.usecase';
import { UpdatePasswordUsecase } from '@/users/application/usecases/update-password.usecase';
import { UpdateUserUsecase } from '@/users/application/usecases/update-user.usecase';
import { SigninDto } from '@/users/infrastructure/dtos/signin.dto';
import { SignupDto } from '@/users/infrastructure/dtos/signup.dto';
import { UpdatePasswordDto } from '@/users/infrastructure/dtos/update-password.dto';
import { UpdateUserDto } from '@/users/infrastructure/dtos/update-user.dto';

import { UsersController } from '../../users.controller';

describe('UsersController unit tests', () => {
  let sut: UsersController;
  let id: string;
  let props: UserOutput;

  beforeEach(async () => {
    id = 'ec2c39ab-c5ab-4022-8330-87430da6636b';
    props = {
      id,
      name: 'Wagner Rodrigues',
      email: 'a@a.com',
      password: '123456',
      createdAt: new Date(),
    };
    sut = new UsersController();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('deve criar um usuário', async () => {
    const output: SignupUseCase.Output = props;

    const mockSignupUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['signupUseCase'] = mockSignupUseCase as any;

    const input: SignupDto = {
      name: 'Wagner Rodrigues',
      email: 'a@a.com',
      password: '123456',
    };
    const result = await sut.create(input);

    expect(output).toMatchObject(result);
    expect(mockSignupUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('deve autenticar um usuário', async () => {
    const output: SigninUseCase.Output = props;

    const mockSigninUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['signinUseCase'] = mockSigninUseCase as any;

    const input: SigninDto = {
      email: 'a@a.com',
      password: '123456',
    };
    const result = await sut.login(input);

    expect(output).toMatchObject(result);
    expect(mockSigninUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('deve atualizar um usuário', async () => {
    const output: UpdateUserUsecase.Output = props;

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['updateUserUsecase'] = mockUpdateUseCase as any;

    const input: UpdateUserDto = {
      name: 'Wagner Luiz',
    };
    const result = await sut.update(id, input);

    expect(output).toMatchObject(result);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
  });

  it('deve atualizar a senha de um usuário', async () => {
    const output: UpdatePasswordUsecase.Output = props;

    const mockUpdatePasswordUsecase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['updatePasswordUsecase'] = mockUpdatePasswordUsecase as any;

    const input: UpdatePasswordDto = {
      password: '654321',
      oldPassword: '123456',
    };
    const result = await sut.updatePassword(id, input);

    expect(output).toMatchObject(result);
    expect(mockUpdatePasswordUsecase.execute).toHaveBeenCalledWith({ id, ...input });
  });

  it('deve apagar um usuário', async () => {
    const output = undefined;

    const mockDeleteUsecase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['deleteUserUsecase'] = mockDeleteUsecase as any;

    const result = await sut.remove(id);

    expect(output).toStrictEqual(result);
    expect(mockDeleteUsecase.execute).toHaveBeenCalledWith({ id });
  });

  it('deve obter um usuário por id', async () => {
    const output: GetUserUsecase.Output = props;

    const mockGetUserUsecase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['getUserUsecase'] = mockGetUserUsecase as any;

    const result = await sut.findOne(id);

    expect(output).toStrictEqual(result);
    expect(mockGetUserUsecase.execute).toHaveBeenCalledWith({ id });
  });

  it('deve listar os usuários', async () => {
    const output: ListUsersUsecase.Output = {
      items: [props],
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
      total: 1,
    };

    const mockListUsersUsecase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['listUsersUsecase'] = mockListUsersUsecase as any;

    const searchParams = {
      page: 1,
      perPage: 1,
    };
    const result = await sut.search(searchParams);

    expect(output).toMatchObject(result);
    expect(mockListUsersUsecase.execute).toHaveBeenCalledWith(searchParams);
  });
});

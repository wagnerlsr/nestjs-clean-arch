import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';
import { HashProdider } from '@/shared/application/providers/hash-prodider';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { SigninUseCase } from '@/users/application/usecases/signin.usecase';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';

describe('SigninUseCase unit test', () => {
  let sut: SigninUseCase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProdider: HashProdider;

  beforeEach(async () => {
    repository = new UserInMemoryRepository();
    hashProdider = new BcryptjsHashProvider();
    sut = new SigninUseCase.UseCase(repository, hashProdider);
  });

  it('deve criar um usuário', async () => {
    const spyFindByEmail = jest.spyOn(repository, 'findByEmail');
    const hashPassword = await hashProdider.generateHash('123456');
    const entity = new UserEntity(
      UserDataBuilder({ email: 'aa@aaa.com', password: hashPassword }),
    );

    repository.items = [entity];

    const result = await sut.execute({
      email: entity.email,
      password: '123456',
    });

    expect(result).toStrictEqual(entity.toJSON());
    expect(spyFindByEmail).toHaveBeenCalledTimes(1);
  });

  it('deve lançar um erro quando o email não for passado', async () => {
    await expect(() =>
      sut.execute({ email: null, password: '123456' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('deve lançar um erro quando a senha não for passada', async () => {
    await expect(() =>
      sut.execute({ email: 'aa@aaa.com', password: null }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('não deve autenticar quando o email não for encontrado', async () => {
    await expect(() =>
      sut.execute({ email: 'aa@aaa.com', password: '123456' }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('não deve autenticar quando a senha estiver errada', async () => {
    const hashPassword = await hashProdider.generateHash('123456');
    const entity = new UserEntity(
      UserDataBuilder({ email: 'aa@aaa.com', password: hashPassword }),
    );

    repository.items = [entity];

    await expect(() =>
      sut.execute({ email: 'aa@aaa.com', password: '123' }),
    ).rejects.toThrow(new InvalidCredentialsError('Credenciais invalidas'));
  });
});

import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { HashProdider } from '@/shared/application/providers/hash-prodider';
import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { SignupUseCase } from '@/users/application/usecases/signup.usecase';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';

describe('SignupUseCase unit test', () => {
  let sut: SignupUseCase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProdider: HashProdider;

  beforeEach(async () => {
    repository = new UserInMemoryRepository();
    hashProdider = new BcryptjsHashProvider();
    sut = new SignupUseCase.UseCase(repository, hashProdider);
  });

  it('deve criar um usuário', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');
    const props = UserDataBuilder({});
    const result = await sut.execute({
      name: props.name,
      email: props.email,
      password: props.password,
    });

    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(spyInsert).toHaveBeenCalledTimes(1);
  });

  it('não deve poder registrar com o mesmo email duas vezes', async () => {
    const props = UserDataBuilder({ email: 'aa@aaa.com' });
    await sut.execute(props);

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(ConflictError);
  });

  it('deve lançar um erro quando o nome não for passado', async () => {
    const props = Object.assign(UserDataBuilder({}), { name: null });

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(BadRequestError);
  });

  it('deve lançar um erro quando o email não for passado', async () => {
    const props = Object.assign(UserDataBuilder({}), { email: null });

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(BadRequestError);
  });

  it('deve lançar um erro quando a senha não for passada', async () => {
    const props = Object.assign(UserDataBuilder({}), { password: null });

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(BadRequestError);
  });
});

import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';
import { HashProdider } from '@/shared/application/providers/hash-prodider';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UpdatePasswordUsecase } from '@/users/application/usecases/update-password.usecase';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';

describe('UpdatePasswordUsecase unit test', () => {
  let sut: UpdatePasswordUsecase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProdider: HashProdider;

  beforeEach(async () => {
    repository = new UserInMemoryRepository();
    hashProdider = new BcryptjsHashProvider();
    sut = new UpdatePasswordUsecase.UseCase(repository, hashProdider);
  });

  it('deve disparar um erro quando usuário não encontrado', async () => {
    await expect(() =>
      sut.execute({
        id: 'fakeId',
        password: 'test password',
        oldPassword: 'old password',
      }),
    ).rejects.toThrow(new NotFoundError('Entity not found'));
  });

  it('deve disparar um erro quando senha antiga não fornecida', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    repository.items = [entity];

    await expect(() =>
      sut.execute({ id: entity._id, password: 'test password', oldPassword: '' }),
    ).rejects.toThrow(
      new InvalidPasswordError('A nova senha e a antiga devem ser informadas'),
    );
  });

  it('deve disparar um erro quando nova senha não fornecida', async () => {
    const entity = new UserEntity(UserDataBuilder({ password: '123456' }));
    repository.items = [entity];

    await expect(() =>
      sut.execute({ id: entity._id, password: '', oldPassword: '123456' }),
    ).rejects.toThrow(
      new InvalidPasswordError('A nova senha e a antiga devem ser informadas'),
    );
  });

  it('deve disparar um erro quando senha não confere', async () => {
    const hashPassword = await hashProdider.generateHash('123456');
    const entity = new UserEntity(UserDataBuilder({ password: hashPassword }));
    repository.items = [entity];

    await expect(() =>
      sut.execute({ id: entity._id, password: '654321', oldPassword: '1234' }),
    ).rejects.toThrow(new InvalidPasswordError('Senha a ser trocada invalida'));
  });

  it('deve atualizar a senha do usuário', async () => {
    const spyUpdatePassword = jest.spyOn(repository, 'update');
    const hashPassword = await hashProdider.generateHash('123456');
    const items = [new UserEntity(UserDataBuilder({ password: hashPassword }))];

    repository.items = items;

    const result = await sut.execute({
      id: items[0]._id,
      password: '654321',
      oldPassword: '123456',
    });

    const checkNewPassword = await hashProdider.compareHash('654321', result.password);

    expect(spyUpdatePassword).toHaveBeenCalledTimes(1);
    expect(checkNewPassword).toBeTruthy();
  });
});

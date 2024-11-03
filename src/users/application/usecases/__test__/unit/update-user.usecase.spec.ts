import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UpdateUserUsecase } from '@/users/application/usecases/update-user.usecase';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';

describe('UpdateUserUsecase unit test', () => {
  let sut: UpdateUserUsecase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(async () => {
    repository = new UserInMemoryRepository();
    sut = new UpdateUserUsecase.UseCase(repository);
  });

  it('deve disparar um erro quando usuário não encontrado', async () => {
    await expect(() => sut.execute({ id: 'fakeId', name: 'test' })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('deve disparar um erro quando name não fornecido', async () => {
    await expect(() => sut.execute({ id: 'fakeId', name: '' })).rejects.toThrow(
      new BadRequestError('Nome não fornecido'),
    );
  });

  it('deve atualizar os dado do usuário', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const items = [new UserEntity(UserDataBuilder({}))];
    repository.items = items;
    const result = await sut.execute({ id: items[0]._id, name: 'test' });

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual({ id: items[0].id, ...items[0].props });
  });
});

import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { DeleteUserUsecase } from '@/users/application/usecases/delete-user.usecase';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';

describe('DeleteUserUsecase unit test', () => {
  let sut: DeleteUserUsecase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(async () => {
    repository = new UserInMemoryRepository();
    sut = new DeleteUserUsecase.UseCase(repository);
  });

  it('deve disparar um erro quando usuário não encontrado', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('deve deletar o usuário', async () => {
    const spyDelete = jest.spyOn(repository, 'delete');
    const items = [new UserEntity(UserDataBuilder({}))];
    repository.items = items;

    expect(repository.items).toHaveLength(1);
    await sut.execute({ id: items[0]._id });
    expect(spyDelete).toHaveBeenCalledTimes(1);
    expect(repository.items).toHaveLength(0);
  });
});

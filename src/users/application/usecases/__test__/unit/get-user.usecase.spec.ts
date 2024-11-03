import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { GetUserUsecase } from '@/users/application/usecases/get-user.usecase';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';

describe('GetUserUseCase unit test', () => {
  let sut: GetUserUsecase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(async () => {
    repository = new UserInMemoryRepository();
    sut = new GetUserUsecase.UseCase(repository);
  });

  it('deve disparar um erro quando usuário não encontrado', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('deve obter os dado do usuário', async () => {
    const spyFindById = jest.spyOn(repository, 'findById');
    const items = [new UserEntity(UserDataBuilder({}))];
    repository.items = items;
    const result = await sut.execute({ id: items[0]._id });

    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual({ id: items[0].id, ...items[0].props });
  });
});

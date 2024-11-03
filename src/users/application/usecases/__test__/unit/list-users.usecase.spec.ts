import { PaginationOutputMapper } from '@/shared/application/dtos/pagination-output';
import { SearchResult } from '@/shared/domain/repositories/searchable-repository-contracts';
import { ListUsersUsecase } from '@/users/application/usecases/list-users.usecase';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';

describe('ListusersUsecase unit test', () => {
  let sut: ListUsersUsecase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(async () => {
    repository = new UserInMemoryRepository();
    sut = new ListUsersUsecase.UseCase(repository);
  });

  it('metodo toOutput', async () => {
    let result = new UserRepository.SearchResult({
      items: [] as any,
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: '',
      sortDir: 'asc',
      filter: 'fake',
    });
    let output = sut['toOutput'](result);

    expect(output).toStrictEqual({
      items: [],
      total: 1,
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
    });

    const entity = new UserEntity(UserDataBuilder({}));
    result = new UserRepository.SearchResult({
      items: [entity],
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: '',
      sortDir: 'asc',
      filter: 'fake',
    });
    output = sut['toOutput'](result);

    expect(output).toStrictEqual({
      items: [entity.toJSON()],
      total: 1,
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
    });
  });

  it('deve retornar os usuarios ordenados por createdAt', async () => {
    const createdAt = new Date();
    const items = [
      new UserEntity(UserDataBuilder({ createdAt })),
      new UserEntity(UserDataBuilder({ createdAt: new Date(createdAt.getTime() + 1) })),
      new UserEntity(UserDataBuilder({ createdAt: new Date(createdAt.getTime() + 2) })),
    ];

    repository.items = items;

    const output = await sut.execute({});

    expect(output).toStrictEqual({
      items: [...items].reverse().map((item) => item.toJSON()),
      total: 3,
      currentPage: 1,
      perPage: 15,
      lastPage: 1,
    });
  });

  it('deve retornar os usuarios usando paginação, ordenação e filtro', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'a' })),
      new UserEntity(UserDataBuilder({ name: 'AA' })),
      new UserEntity(UserDataBuilder({ name: 'Aa' })),
      new UserEntity(UserDataBuilder({ name: 'c' })),
      new UserEntity(UserDataBuilder({ name: 'b' })),
    ];

    repository.items = items;

    let output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    });

    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    });

    output = await sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    });

    expect(output).toStrictEqual({
      items: [items[0].toJSON()],
      total: 3,
      currentPage: 2,
      perPage: 2,
      lastPage: 2,
    });
  });
});

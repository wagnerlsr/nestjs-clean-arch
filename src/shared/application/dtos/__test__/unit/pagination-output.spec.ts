import { PaginationOutputMapper } from '@/shared/application/dtos/pagination-output';
import { SearchResult } from '@/shared/domain/repositories/searchable-repository-contracts';

describe('PaginationOutputMapper unit test', () => {
  it('deve converter um SearchResult em output', async () => {
    const result = new SearchResult({
      items: ['fake'] as any,
      total: 1,
      currentPage: 1,
      perPage: 1,
      sort: '',
      sortDir: 'asc',
      filter: 'fake',
    });
    const sut = PaginationOutputMapper.toOutput(result.items, result);

    expect(sut).toStrictEqual({
      items: ['fake'] as any,
      total: 1,
      currentPage: 1,
      perPage: 1,
      lastPage: 1,
    });
  });
});

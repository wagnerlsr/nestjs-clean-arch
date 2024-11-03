import { Entity } from '@/shared/domain/entities/entity';
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository';
import {
  SearchParams,
  SearchResult,
} from '@/shared/domain/repositories/searchable-repository-contracts';

type StubEntityProps = {
  name: string;
  price: number;
};
class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name'];

  protected async applyFilter(
    items: StubEntity[],
    filter: string | null,
  ): Promise<StubEntity[]> {
    if (!filter) return items;

    return items.filter((item) => {
      return item.props.name.toLowerCase().includes(filter.toLowerCase());
    });
  }
}

describe('InMemorySearchableRepository unit tests', () => {
  let sut: StubInMemorySearchableRepository;

  beforeEach(() => {
    sut = new StubInMemorySearchableRepository();
  });

  describe('applyFilter method', () => {
    it('não deve filtrar quando o parâmetro filter é nulo', async () => {
      const items = [new StubEntity({ name: 'nome', price: 50 })];
      const spyFilterMethod = jest.spyOn(items, 'filter');
      const itemsFiltered = await sut['applyFilter'](items, null);

      expect(itemsFiltered).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it('deve filtrar quando o parâmetro filter for passado', async () => {
      const items = [
        new StubEntity({ name: 'nome', price: 100 }),
        new StubEntity({ name: 'NOME', price: 200 }),
        new StubEntity({ name: 'fake', price: 300 }),
      ];
      const spyFilterMethod = jest.spyOn(items, 'filter');
      let itemsFiltered = await sut['applyFilter'](items, 'Nome');

      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      itemsFiltered = await sut['applyFilter'](items, 'no-filter');

      expect(itemsFiltered).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);
    });
  });

  describe('applySort method', () => {
    it('não deve ser ordenado quando o parâmetro sort for nulo', async () => {
      const items = [
        new StubEntity({ name: 'nome', price: 100 }),
        new StubEntity({ name: 'NOME', price: 200 }),
        new StubEntity({ name: 'fake', price: 300 }),
      ];

      let itemsSorted = await sut['applySort'](items, null, null);
      expect(itemsSorted).toStrictEqual(items);

      itemsSorted = await sut['applySort'](items, 'price', 'asc');
      expect(itemsSorted).toStrictEqual(items);
    });

    it('deve ser ordenado quando o parâmetro sort for passado', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 100 }),
        new StubEntity({ name: 'c', price: 200 }),
        new StubEntity({ name: 'a', price: 300 }),
      ];

      let itemsSorted = await sut['applySort'](items, 'name', 'asc');
      expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]]);

      itemsSorted = await sut['applySort'](items, 'name', 'desc');
      expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]]);
    });
  });

  describe('applyPaginate method', () => {
    it('deve paginar os itens', async () => {
      const items = [
        new StubEntity({ name: 'a', price: 100 }),
        new StubEntity({ name: 'b', price: 200 }),
        new StubEntity({ name: 'c', price: 300 }),
        new StubEntity({ name: 'd', price: 400 }),
        new StubEntity({ name: 'e', price: 500 }),
      ];

      let itemsPaginated = await sut['applyPaginate'](items, 1, 2);
      expect(itemsPaginated).toStrictEqual([items[0], items[1]]);

      itemsPaginated = await sut['applyPaginate'](items, 2, 2);
      expect(itemsPaginated).toStrictEqual([items[2], items[3]]);

      itemsPaginated = await sut['applyPaginate'](items, 3, 2);
      expect(itemsPaginated).toStrictEqual([items[4]]);

      itemsPaginated = await sut['applyPaginate'](items, 4, 2);
      expect(itemsPaginated).toStrictEqual([]);
    });
  });

  describe('search method', () => {
    it('deve aplicar apenas paginação quando os outros parametros são nulos', async () => {
      const entity = new StubEntity({ name: 'nome', price: 100 });
      const items = Array(16).fill(entity);

      sut.items = items;

      const params = await sut.search(new SearchParams({}));
      expect(params).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          currentPage: 1,
          perPage: 15,
          sort: null,
          sortDir: null,
          filter: null,
        }),
      );
    });

    it('deve aplicar paginação e filtro', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 100 }),
        new StubEntity({ name: 'fake', price: 200 }),
        new StubEntity({ name: 'TEST', price: 300 }),
        new StubEntity({ name: 'Test', price: 400 }),
      ];

      sut.items = items;

      let params = await sut.search(
        new SearchParams({ page: 1, perPage: 2, filter: 'TEST' }),
      );
      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          currentPage: 1,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: 'TEST',
        }),
      );

      params = await sut.search(
        new SearchParams({ page: 2, perPage: 2, filter: 'TEST' }),
      );
      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3]],
          total: 3,
          currentPage: 2,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: 'TEST',
        }),
      );
    });

    it('deve aplicar paginação e ordenação', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 100 }),
        new StubEntity({ name: 'd', price: 200 }),
        new StubEntity({ name: 'a', price: 300 }),
        new StubEntity({ name: 'e', price: 400 }),
        new StubEntity({ name: 'c', price: 500 }),
      ];

      sut.items = items;

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
        }),
      );
      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[2], items[0]],
          total: 5,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: null,
        }),
      );

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
        }),
      );
      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[4], items[1]],
          total: 5,
          currentPage: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: null,
        }),
      );
    });
  });
});

import { Entity } from '@/shared/domain/entities/entity';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { InMemoryRepository } from '@/shared/domain/repositories/in-memory.repository';

type StubEntityProps = {
  name: string;
  price: number;
};
class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository unit tests', () => {
  let sut: StubInMemoryRepository;

  beforeEach(() => {
    sut = new StubInMemoryRepository();
  });

  it('deve inserir uma nova entidade', async () => {
    const entity = new StubEntity({ name: 'nome', price: 50 });
    await sut.insert(entity);

    expect(entity.toJSON()).toStrictEqual(sut.items[0].toJSON());
  });

  it('deve lançar um erro quando entidade não encontrada', async () => {
    await expect(sut.findById('fakeId')).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('deve encontrar uma entidade por id', async () => {
    const entity = new StubEntity({ name: 'nome', price: 50 });
    await sut.insert(entity);
    const result = await sut.findById(entity.id as any);

    expect(entity.toJSON()).toStrictEqual(result.toJSON());
  });

  it('deve retornar todas entidades', async () => {
    const entity = new StubEntity({ name: 'nome', price: 50 });
    await sut.insert(entity);
    const result = await sut.findAll();

    expect([entity]).toStrictEqual(result);
  });

  it('deve lançar um erro na atualização de uma entidade não encontrada', async () => {
    const entity = new StubEntity({ name: 'nome', price: 50 });

    await expect(sut.update(entity)).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('deve atualizar uma entidade', async () => {
    const entity = new StubEntity({ name: 'nome', price: 50 });
    await sut.insert(entity);
    const entityUp = new StubEntity({ name: 'nome atualizado', price: 100 }, entity._id);
    await sut.update(entityUp);

    expect(entityUp.toJSON()).toStrictEqual(sut.items[0].toJSON());
  });

  it('deve lançar um erro ao tentar apagar uma entidade inexistente', async () => {
    await expect(sut.delete('fakeId')).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('deve apagar uma entidade', async () => {
    const entity = new StubEntity({ name: 'nome', price: 50 });
    await sut.insert(entity);
    await sut.delete(entity._id);

    expect(sut.items).toHaveLength(0);
  });
});

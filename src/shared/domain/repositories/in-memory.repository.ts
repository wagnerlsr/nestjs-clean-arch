import { Entity } from '@/shared/domain/entities/entity';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { RepositoryInterface } from '@/shared/domain/repositories/repository-contracts';

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  items: E[] = [];

  async delete(id: string): Promise<void> {
    await this._get(id);
    const index = this.items.findIndex((item: any) => item.id === id);
    this.items.splice(index, 1);
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  async findById(id: string): Promise<E> {
    return this._get(id);
  }

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async update(entity: E): Promise<void> {
    await this._get((entity as any).id);
    const index = this.items.findIndex((item: any) => item.id === entity.id);
    this.items[index] = entity;
  }

  protected async _get(id: string): Promise<E> {
    const _id = `${id}`;
    const entity = this.items.find((item: any) => item.id === _id);

    if (!entity) throw new NotFoundError('Entity not found');

    return entity;
  }
}

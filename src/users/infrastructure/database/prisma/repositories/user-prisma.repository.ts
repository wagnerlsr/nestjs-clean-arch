import { filter } from 'rxjs';

import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserModelMapper } from '@/users/infrastructure/database/prisma/models/user-model.mapper';

export class UserPrismaRepository implements UserRepository.Repository {
  sortableFields: string[] = ['name', 'createdAt'];

  constructor(private prismaService: PrismaService) {}

  async delete(id: string): Promise<void> {
    await this._get(id);
    await this.prismaService.user.delete({
      where: { id },
    });
  }

  async emailExists(email: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (user) throw new ConflictError('Endereço de e-mail já cadastrado');
  }

  async findAll(): Promise<UserEntity[]> {
    const models = await this.prismaService.user.findMany();
    return models.map((model) => UserModelMapper.toEntity(model));
  }

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({ where: { email } });
      return UserModelMapper.toEntity(user);
    } catch {
      throw new NotFoundError(`UserModel não encontrado usando email ${email}`);
    }
  }

  async findById(id: string): Promise<UserEntity> {
    return this._get(id);
  }

  async insert(entity: UserEntity): Promise<void> {
    await this.prismaService.user.create({ data: entity.toJSON() });
  }

  async search(props: UserRepository.SearchParams): Promise<UserRepository.SearchResult> {
    const sortable = this.sortableFields?.includes(props.sort) || false;
    const orderByField = sortable ? props.sort : 'createdAt';
    const orderByDir = sortable ? props.sortDir : 'desc';

    const count = await this.prismaService.user.count({
      ...(props.filter && {
        where: { name: { contains: props.filter, mode: 'insensitive' } },
      }),
    });

    const models = await this.prismaService.user.findMany({
      ...(props.filter && {
        where: { name: { contains: props.filter, mode: 'insensitive' } },
      }),
      orderBy: { [orderByField]: orderByDir },
      skip: props.page && props.page > 0 ? (props.page - 1) * props.perPage : 1,
      take: props.perPage && props.perPage > 0 ? props.perPage : 15,
    });

    return new UserRepository.SearchResult({
      items: models.map((model) => UserModelMapper.toEntity(model)),
      currentPage: props.page,
      sort: props.sort,
      sortDir: props.sortDir,
      filter: props.filter,
      perPage: props.perPage,
      total: count,
    });
  }

  async update(entity: UserEntity): Promise<void> {
    await this._get(entity._id);
    await this.prismaService.user.update({
      where: { id: entity._id },
      data: entity.toJSON(),
    });
  }

  protected async _get(id: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({ where: { id } });
      return UserModelMapper.toEntity(user);
    } catch {
      throw new NotFoundError(`UserModel não encontrado usando id ${id}`);
    }
  }
}

import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts';
import { ListUsersUsecase } from '@/users/application/usecases/list-users.usecase';

export class ListUsersDto implements ListUsersUsecase.Input {
  page?: number;
  perPage?: number;
  sort?: string;
  sortDir?: SortDirection;
  filter?: string;
}

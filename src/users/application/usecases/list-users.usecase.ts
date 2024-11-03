import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output';
import { SearchInput } from '@/shared/application/dtos/search-input';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import { UserOutput, UserOutputMapper } from '@/users/application/dtos/user-output';
import { UserRepository } from '@/users/domain/repositories/user.repository';

export namespace ListUsersUsecase {
  export type Input = SearchInput;
  export type Output = PaginationOutput<UserOutput>;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const searchResult = await this.userRepository.search(
        new UserRepository.SearchParams(input),
      );

      return this.toOutput(searchResult);
    }

    private toOutput(searchResult: UserRepository.SearchResult): Output {
      return PaginationOutputMapper.toOutput(
        searchResult.items.map((item) => UserOutputMapper.toOutput(item)),
        searchResult,
      );
    }
  }
}

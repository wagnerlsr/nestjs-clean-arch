import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import { UserOutput, UserOutputMapper } from '@/users/application/dtos/user-output';
import { UserRepository } from '@/users/domain/repositories/user.repository';

export namespace UpdateUserUsecase {
  export type Input = {
    id: string;
    name: string;
  };

  export type Output = UserOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      if (!input.name) throw new BadRequestError('Nome não fornecido');

      const entity = await this.userRepository.findById(input.id);

      entity.update(input.name);
      await this.userRepository.update(entity);

      return UserOutputMapper.toOutput(entity);
    }
  }
}

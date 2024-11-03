import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { HashProdider } from '@/shared/application/providers/hash-prodider';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import { UserOutput, UserOutputMapper } from '@/users/application/dtos/user-output';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';

export namespace SignupUseCase {
  export type Input = {
    name: string;
    email: string;
    password: string;
  };

  export type Output = UserOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProdider: HashProdider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { name, email, password } = input;

      if (!name || !email || !password)
        throw new BadRequestError('Dados de entrada não providos');

      await this.userRepository.emailExists(email);

      const hashPassword = await this.hashProdider.generateHash(password);
      const entity = new UserEntity(Object.assign(input, { password: hashPassword }));

      await this.userRepository.insert(entity);

      return UserOutputMapper.toOutput(entity);
    }
  }
}

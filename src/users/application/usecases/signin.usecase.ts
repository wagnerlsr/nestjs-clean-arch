import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';
import { HashProdider } from '@/shared/application/providers/hash-prodider';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import { UserOutput, UserOutputMapper } from '@/users/application/dtos/user-output';
import { UserRepository } from '@/users/domain/repositories/user.repository';

export namespace SigninUseCase {
  export type Input = {
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
      const { email, password } = input;

      if (!email || !password) throw new BadRequestError('Dados de entrada não providos');

      const entity = await this.userRepository.findByEmail(email);

      const hashPasswordMatches = await this.hashProdider.compareHash(
        password,
        entity.password,
      );

      if (!hashPasswordMatches)
        throw new InvalidCredentialsError('Credenciais invalidas');

      return UserOutputMapper.toOutput(entity);
    }
  }
}

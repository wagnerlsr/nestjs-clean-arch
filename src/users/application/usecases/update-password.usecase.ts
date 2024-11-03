import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';
import { HashProdider } from '@/shared/application/providers/hash-prodider';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import { UserOutput, UserOutputMapper } from '@/users/application/dtos/user-output';
import { UserRepository } from '@/users/domain/repositories/user.repository';

export namespace UpdatePasswordUsecase {
  export type Input = {
    id: string;
    password: string;
    oldPassword: string;
  };

  export type Output = UserOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProdider: HashProdider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id);

      if (!input.password || !input.oldPassword)
        throw new InvalidPasswordError('A nova senha e a antiga devem ser informadas');

      const checkOldPassword = await this.hashProdider.compareHash(
        input.oldPassword,
        entity.password,
      );

      if (!checkOldPassword)
        throw new InvalidPasswordError('Senha a ser trocada invalida');

      const hashPassword = await this.hashProdider.generateHash(input.password);

      entity.updatePassword(hashPassword);
      await this.userRepository.update(entity);

      return UserOutputMapper.toOutput(entity);
    }
  }
}

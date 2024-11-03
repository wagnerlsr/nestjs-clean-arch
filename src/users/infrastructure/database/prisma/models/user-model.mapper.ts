import { User } from '@prisma/client';

import { ValidationError } from '@/shared/domain/errors/validation-error';
import { UserEntity } from '@/users/domain/entities/user.entity';

export class UserModelMapper {
  static toEntity(model: User) {
    const data = {
      name: model.name,
      email: model.email,
      password: model.password,
      createdAt: model.createdAt,
    };

    try {
      return new UserEntity(data, model.id);
    } catch {
      throw new ValidationError('A entidade não pode ser carregada');
    }
  }
}

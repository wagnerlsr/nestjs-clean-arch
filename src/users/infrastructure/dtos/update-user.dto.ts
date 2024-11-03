import { UpdateUserUsecase } from '@/users/application/usecases/update-user.usecase';

export class UpdateUserDto implements Omit<UpdateUserUsecase.Input, 'id'> {
  name: string;
}

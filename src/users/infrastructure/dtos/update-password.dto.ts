import { UpdatePasswordUsecase } from '@/users/application/usecases/update-password.usecase';

export class UpdatePasswordDto implements Omit<UpdatePasswordUsecase.Input, 'id'> {
  oldPassword: string;
  password: string;
}

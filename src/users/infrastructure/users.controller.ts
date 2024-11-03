import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { UserOutput } from '@/users/application/dtos/user-output';
import { DeleteUserUsecase } from '@/users/application/usecases/delete-user.usecase';
import { GetUserUsecase } from '@/users/application/usecases/get-user.usecase';
import { ListUsersUsecase } from '@/users/application/usecases/list-users.usecase';
import { SigninUseCase } from '@/users/application/usecases/signin.usecase';
import { SignupUseCase } from '@/users/application/usecases/signup.usecase';
import { UpdatePasswordUsecase } from '@/users/application/usecases/update-password.usecase';
import { UpdateUserUsecase } from '@/users/application/usecases/update-user.usecase';
import { ListUsersDto } from '@/users/infrastructure/dtos/list-users.dto';
import { SigninDto } from '@/users/infrastructure/dtos/signin.dto';
import { SignupDto } from '@/users/infrastructure/dtos/signup.dto';
import { UpdatePasswordDto } from '@/users/infrastructure/dtos/update-password.dto';
import { UpdateUserDto } from '@/users/infrastructure/dtos/update-user.dto';
import { UserPresenter } from '@/users/infrastructure/presenters/user.presenter';

@Controller('users')
export class UsersController {
  @Inject(SignupUseCase.UseCase)
  private signupUseCase: SignupUseCase.UseCase;

  @Inject(SigninUseCase.UseCase)
  private signinUseCase: SigninUseCase.UseCase;

  @Inject(GetUserUsecase.UseCase)
  private getUserUsecase: GetUserUsecase.UseCase;

  @Inject(ListUsersUsecase.UseCase)
  private listUsersUsecase: ListUsersUsecase.UseCase;

  @Inject(UpdateUserUsecase.UseCase)
  private updateUserUsecase: UpdateUserUsecase.UseCase;

  @Inject(UpdatePasswordUsecase.UseCase)
  private updatePasswordUsecase: UpdatePasswordUsecase.UseCase;

  @Inject(DeleteUserUsecase.UseCase)
  private deleteUserUsecase: DeleteUserUsecase.UseCase;

  static userToResponse(output: UserOutput) {
    return new UserPresenter(output);
  }

  @Post()
  async create(@Body() signupDto: SignupDto) {
    const output = await this.signupUseCase.execute(signupDto);
    return UsersController.userToResponse(output);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() signinDto: SigninDto) {
    const output = await this.signinUseCase.execute(signinDto);
    return UsersController.userToResponse(output);
  }

  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    return this.listUsersUsecase.execute(searchParams);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getUserUsecase.execute({ id });
    return UsersController.userToResponse(output);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const output = await this.updateUserUsecase.execute({ id, ...updateUserDto });
    return UsersController.userToResponse(output);
  }

  @Patch(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const output = await this.updatePasswordUsecase.execute({ id, ...updatePasswordDto });
    return UsersController.userToResponse(output);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.deleteUserUsecase.execute({ id });
  }
}

import { UserOutputMapper } from '@/users/application/dtos/user-output';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

describe('UserOutputMapper unit test', () => {
  it('deve converter um usuário em output', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    const spyToJson = jest.spyOn(entity, 'toJSON');
    const sut = UserOutputMapper.toOutput(entity);

    expect(spyToJson).toHaveBeenCalled();
    expect(sut).toStrictEqual(entity.toJSON());
  });
});

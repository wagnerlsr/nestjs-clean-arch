import { hash } from 'bcryptjs';

import { UserOutput } from '@/users/application/dtos/user-output';
import { UserPresenter } from '@/users/infrastructure/presenters/user.presenter';

describe('UserPresenter unit test', () => {
  const createdAt = new Date();
  const props = {
    id: 'c81912bf-9a10-46a9-b0ed-f13450ac9e5f',
    name: 'test name',
    email: 'a@a.com',
    password: '123456',
    createdAt,
  };

  describe('Constructor', () => {
    it('deve retornar uma senha encriptada', async () => {
      const sut = new UserPresenter(props);
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.email).toEqual(props.email);
      expect(sut.createdAt).toEqual(props.createdAt);
    });
  });
});

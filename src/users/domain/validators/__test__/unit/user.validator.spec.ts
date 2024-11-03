import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import {
  UserRules,
  UserValidator,
  UserValidatorFactory,
} from '@/users/domain/validators/user.validator';

let sut: UserValidator;

describe('UserValidator unit tests', () => {
  beforeEach(async () => {
    sut = UserValidatorFactory.create();
  });

  it('Validação da classe usuário', () => {
    const props = UserDataBuilder({});
    const isValid = sut.validate(props);

    expect(isValid).toBeTruthy();
    expect(sut.validatedData).toStrictEqual(new UserRules(props));
  });

  describe('Campo nome', () => {
    it('Casos de invalidação', () => {
      let isValid = sut.validate(null);

      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
        'name should not be empty',
        'name must be a string',
      ]);

      isValid = sut.validate({ ...UserDataBuilder({}), name: '' });

      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual(['name should not be empty']);

      isValid = sut.validate({ ...UserDataBuilder({}), name: 10 as any });

      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
        'name must be a string',
      ]);

      isValid = sut.validate({ ...UserDataBuilder({}), name: 'a'.repeat(256) });

      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ]);

      // console.log(sut.errors['name']);
    });
  });

  describe('Campo email', () => {
    it('Casos de invalidação', () => {
      let isValid = sut.validate(null);

      expect(isValid).toBeFalsy();
      expect(sut.errors['email']).toStrictEqual([
        'email must be shorter than or equal to 255 characters',
        'email should not be empty',
        'email must be a string',
        'email must be an email',
      ]);

      isValid = sut.validate({ ...UserDataBuilder({}), email: '' });

      expect(isValid).toBeFalsy();
      expect(sut.errors['email']).toStrictEqual([
        'email should not be empty',
        'email must be an email',
      ]);

      isValid = sut.validate({ ...UserDataBuilder({}), email: 10 as any });

      expect(isValid).toBeFalsy();
      expect(sut.errors['email']).toStrictEqual([
        'email must be shorter than or equal to 255 characters',
        'email must be a string',
        'email must be an email',
      ]);

      isValid = sut.validate({ ...UserDataBuilder({}), email: 'a'.repeat(256) });

      expect(isValid).toBeFalsy();
      expect(sut.errors['email']).toStrictEqual([
        'email must be shorter than or equal to 255 characters',
        'email must be an email',
      ]);
    });
  });

  describe('Campo password', () => {
    it('Casos de invalidação', () => {
      let isValid = sut.validate(null);

      expect(isValid).toBeFalsy();
      expect(sut.errors['password']).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
        'password should not be empty',
        'password must be a string',
      ]);

      isValid = sut.validate({ ...UserDataBuilder({}), password: '' });

      expect(isValid).toBeFalsy();
      expect(sut.errors['password']).toStrictEqual(['password should not be empty']);

      isValid = sut.validate({ ...UserDataBuilder({}), password: 10 as any });

      expect(isValid).toBeFalsy();
      expect(sut.errors['password']).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
        'password must be a string',
      ]);

      isValid = sut.validate({ ...UserDataBuilder({}), password: 'a'.repeat(101) });

      expect(isValid).toBeFalsy();
      expect(sut.errors['password']).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
      ]);

      console.log(sut.errors['password']);
    });
  });

  describe('Campo createdAt', () => {
    it('Casos de invalidação', () => {
      let isValid = sut.validate({
        ...UserDataBuilder({}),
        createdAt: 10 as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ]);

      isValid = sut.validate({
        ...UserDataBuilder({}),
        createdAt: '1000' as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ]);
    });
  });
});

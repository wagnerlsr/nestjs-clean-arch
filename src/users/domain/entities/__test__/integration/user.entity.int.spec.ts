import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { UserEntity, UserProps } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

describe('UserEntity integration tests', () => {
  describe('Metodo construtor', () => {
    it('Deve disparar um erro quando criando um usuário com nome invalido', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        name: null,
      };

      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);

      props = {
        ...UserDataBuilder({}),
        name: '',
      };

      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);

      props = {
        ...UserDataBuilder({}),
        name: 'a'.repeat(256),
      };

      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });

    it('Deve disparar um erro quando criando um usuário com email invalido', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        email: null,
      };

      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);

      props = {
        ...UserDataBuilder({}),
        email: '',
      };

      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);

      props = {
        ...UserDataBuilder({}),
        email: 'a'.repeat(256),
      };

      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });

    it('Deve disparar um erro quando criando um usuário com senha invalido', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        password: null,
      };

      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);

      props = {
        ...UserDataBuilder({}),
        password: '',
      };

      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);

      props = {
        ...UserDataBuilder({}),
        password: 'a'.repeat(101),
      };

      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });

    it('Deve disparar um erro quando criando um usuário com createdAt invalido', () => {
      const props: UserProps = {
        ...UserDataBuilder({}),
        createdAt: '1000' as any,
      };

      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });

    it('Deve ser um usuário valido', () => {
      expect.assertions(0);

      const props: UserProps = {
        ...UserDataBuilder({}),
      };

      new UserEntity(props);
    });
  });

  describe('Metodo update', () => {
    it('Deve disparar um erro quando atualizando um usuário com nome invalido', () => {
      const entity = new UserEntity(UserDataBuilder({}));

      expect(() => entity.update(null)).toThrowError(EntityValidationError);
      expect(() => entity.update('')).toThrowError(EntityValidationError);
      expect(() => entity.update(10 as any)).toThrowError(EntityValidationError);
      expect(() => entity.update('a'.repeat(256))).toThrowError(EntityValidationError);
    });

    it('Deve ser um usuário valido', () => {
      expect.assertions(0);

      const entity = new UserEntity(UserDataBuilder({}));

      entity.update('novo nome');
    });
  });

  describe('Metodo updatePassword', () => {
    it('Deve disparar um erro quando atualizando um usuário com senha invalida', () => {
      const entity = new UserEntity(UserDataBuilder({}));

      expect(() => entity.updatePassword(null)).toThrowError(EntityValidationError);
      expect(() => entity.updatePassword('')).toThrowError(EntityValidationError);
      expect(() => entity.updatePassword(10 as any)).toThrowError(EntityValidationError);
      expect(() => entity.updatePassword('a'.repeat(101))).toThrowError(
        EntityValidationError,
      );
    });

    it('Deve ser um usuário valido', () => {
      expect.assertions(0);

      const entity = new UserEntity(UserDataBuilder({}));

      entity.updatePassword('nova senha');
    });
  });
});

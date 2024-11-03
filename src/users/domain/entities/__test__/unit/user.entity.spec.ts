import { UserEntity, UserProps } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

describe('UserEntity unit test', () => {
  let props: UserProps;
  let sut: UserEntity;

  beforeEach(async () => {
    UserEntity.validate = jest.fn();
    props = UserDataBuilder({});
    sut = new UserEntity(props);
  });

  it('Metodo construtor', () => {
    expect(UserEntity.validate).toHaveBeenCalled();
    expect(sut.props.name).toEqual(props.name);
    expect(sut.props.email).toEqual(props.email);
    expect(sut.props.password).toEqual(props.password);
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });

  it('Getter do campo nome', () => {
    expect(sut.name).toBeDefined();
    expect(sut.name).toEqual(props.name);
    expect(typeof sut.name).toEqual('string');
  });

  it('Setter do campo nome', () => {
    sut['name'] = 'outro nome';

    expect(sut.props.name).toEqual(props.name);
    expect(typeof sut.props.name).toEqual('string');
  });

  it('Getter do campo email', () => {
    expect(sut.email).toBeDefined();
    expect(sut.email).toEqual(props.email);
    expect(typeof sut.email).toEqual('string');
  });

  it('Getter do campo password', () => {
    expect(sut.password).toBeDefined();
    expect(sut.password).toEqual(props.password);
    expect(typeof sut.password).toEqual('string');
  });

  it('Setter do campo password', () => {
    sut['password'] = 'outra senha';

    expect(sut.props.password).toEqual(props.password);
    expect(typeof sut.props.password).toEqual('string');
  });

  it('Getter do campo createdAt', () => {
    expect(sut.createdAt).toBeDefined();
    expect(sut.createdAt).toBeInstanceOf(Date);
  });

  it('deve atualizar um usuário', () => {
    sut.update('outro nome');
    expect(UserEntity.validate).toHaveBeenCalled();
    expect(sut.props.name).toEqual('outro nome');
  });

  it('deve atualizar o campo password', () => {
    sut.updatePassword('outra senha');
    expect(UserEntity.validate).toHaveBeenCalled();
    expect(sut.props.password).toEqual('outra senha');
  });
});

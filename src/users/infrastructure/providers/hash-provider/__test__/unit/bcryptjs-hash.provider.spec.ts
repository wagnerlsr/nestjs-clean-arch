import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';

describe('BcryptjsHashProvider unit test', () => {
  let sut: BcryptjsHashProvider;

  beforeEach(async () => {
    sut = new BcryptjsHashProvider();
  });

  it('deve retornar uma senha encriptada', async () => {
    const password = 'TestPassword123';
    const hash = await sut.generateHash(password);

    expect(hash).toBeDefined();
  });

  it('deve retornar falso em uma comparação invalida de hash e senha', async () => {
    const password = 'TestPassword123';
    const hash = await sut.generateHash(password);
    const result = await sut.compareHash('fake', hash);

    expect(result).toBeFalsy();
  });

  it('deve retornar verdadeiro em uma comparação valida de hash e senha', async () => {
    const password = 'TestPassword123';
    const hash = await sut.generateHash(password);
    const result = await sut.compareHash(password, hash);

    expect(result).toBeTruthy();
  });
});

import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';

describe('UserInMemoryRepository unit tests', () => {
  let sut: UserInMemoryRepository;

  beforeEach(async () => {
    sut = new UserInMemoryRepository();
  });

  it('deve disparar um erro quando não encontrar - metodo findByEmail', async () => {
    await expect(sut.findByEmail('aa@aaa.com')).rejects.toThrow(
      new NotFoundError('Usuário não encontrado usando e-mail aa@aaa.com'),
    );
  });

  it('deve encontrar um usuario por email - metodo findByEmail', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await sut.insert(entity);
    const res = await sut.findByEmail(entity.email);

    expect(res.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('deve disparar um erro quando encontrar - metodo emailExists', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await sut.insert(entity);

    await expect(sut.emailExists(entity.email)).rejects.toThrow(
      new ConflictError('Endereço de e-mail já cadastrado'),
    );
  });

  it('não deve disparar um erro quando não encontrar um email - metodo emailExists', async () => {
    expect.assertions(0);
    await sut.emailExists('aa@aaa.com');
  });

  it('não deve filtrar itens quando o objeto filter for nulo', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await sut.insert(entity);
    const res = await sut.findAll();
    const spyFilter = jest.spyOn(res, 'filter');
    const itemsFiltered = await sut['applyFilter'](res, null);

    expect(spyFilter).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(res);
  });

  it('deve filtrar o campo nome usando o parâmetro filter', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'Test' })),
      new UserEntity(UserDataBuilder({ name: 'TEST' })),
      new UserEntity(UserDataBuilder({ name: 'fake' })),
      new UserEntity(UserDataBuilder({ name: 'test' })),
    ];

    const spyFilter = jest.spyOn(items, 'filter');
    const itemsFiltered = await sut['applyFilter'](items, 'TEST');

    expect(spyFilter).toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual([items[0], items[1], items[3]]);
  });

  it('deve ordenar pelo campo createdAt quando o parâmetro sort for nulo', async () => {
    const createdAt = new Date();
    const items = [
      new UserEntity(UserDataBuilder({ name: 'Test', createdAt })),
      new UserEntity(
        UserDataBuilder({ name: 'TEST', createdAt: new Date(createdAt.getTime() + 1) }),
      ),
      new UserEntity(
        UserDataBuilder({ name: 'fake', createdAt: new Date(createdAt.getTime() + 2) }),
      ),
      new UserEntity(
        UserDataBuilder({ name: 'test', createdAt: new Date(createdAt.getTime() + 3) }),
      ),
    ];

    const itemsSorted = await sut['applySort'](items, null, null);

    expect(itemsSorted).toStrictEqual([items[3], items[2], items[1], items[0]]);
  });

  it('deve ordenar pelo campo nome quando o parâmetro sort for name', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'Test' })),
      new UserEntity(UserDataBuilder({ name: 'TEST' })),
      new UserEntity(UserDataBuilder({ name: 'fake' })),
      new UserEntity(UserDataBuilder({ name: 'test' })),
    ];

    let itemsSorted = await sut['applySort'](items, 'name', 'asc');
    expect(itemsSorted).toStrictEqual([items[1], items[0], items[2], items[3]]);

    itemsSorted = await sut['applySort'](items, 'name', null);
    expect(itemsSorted).toStrictEqual([items[3], items[2], items[0], items[1]]);
  });
});

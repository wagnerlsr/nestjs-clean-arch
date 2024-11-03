import { validate as uuidValidate } from 'uuid';

import { Entity } from '@/shared/domain/entities/entity';

type StubProps = {
  prop1: string;
  prop2: number;
};

class StubEntity extends Entity<StubProps> {}

describe('Entity unit test', () => {
  it('deve setar props e id', () => {
    const props = { prop1: 'value1', prop2: 15 };
    const entity = new StubEntity(props);

    expect(entity.props).toStrictEqual(props);
    expect(entity._id).not.toBeNull();
    expect(uuidValidate(entity._id)).toBeTruthy();
  });

  it('deve aceitar um id valido', () => {
    const props = { prop1: 'value1', prop2: 15 };
    const id = '950eda2d-b026-46e6-98c5-3b31b7cc4155';
    const entity = new StubEntity(props, id);

    expect(uuidValidate(entity._id)).toBeTruthy();
    expect(entity._id).toBe(id);
  });

  it('deve converter um entity para object Javascript', () => {
    const props = { prop1: 'value1', prop2: 15 };
    const id = '950eda2d-b026-46e6-98c5-3b31b7cc4155';
    const entity = new StubEntity(props, id);

    expect(entity.toJSON()).toStrictEqual({ id, ...props });
  });
});

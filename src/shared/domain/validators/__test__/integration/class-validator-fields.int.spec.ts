import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields';

class StubRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  constructor(data: any) {
    Object.assign(this, data);
  }
}
class StubClassValidatorFields extends ClassValidatorFields<StubRules> {
  validate(data: any): boolean {
    return super.validate(new StubRules(data));
  }
}

describe('ClassValidatorFields integration tests', () => {
  it('deve validar com erros', () => {
    const validator = new StubClassValidatorFields();

    expect(validator.validate(null)).toBeFalsy();
    expect(validator.errors).toStrictEqual({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ],
      price: [
        'price should not be empty',
        'price must be a number conforming to the specified constraints',
      ],
    });
  });

  it('deve validar sem erros', () => {
    const validator = new StubClassValidatorFields();

    expect(validator.validate({ name: 'value', price: 10 })).toBeTruthy();
    expect(validator.validatedData).toStrictEqual(
      new StubRules({ name: 'value', price: 10 }),
    );
  });
});

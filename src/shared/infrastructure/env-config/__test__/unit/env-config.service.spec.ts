import { Test, TestingModule } from '@nestjs/testing';

import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { EnvConfigService } from '@/shared/infrastructure/env-config/env-config.service';

describe('EnvConfigService unit test', () => {
  let sut: EnvConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvConfigModule.forRoot()],
      providers: [EnvConfigService],
    }).compile();

    sut = module.get<EnvConfigService>(EnvConfigService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('deve retornar a variável PORT', () => {
    expect(sut.getAppPort()).toBe(3000);
  });

  it('deve retornar a variável NODE_ENV', () => {
    expect(sut.getNodeEnv()).toBe('test');
  });
});

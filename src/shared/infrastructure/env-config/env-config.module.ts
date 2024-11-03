import { join } from 'node:path';

import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';

import { EnvConfigService } from './env-config.service';

@Module({
  imports: [ConfigModule],
  exports: [EnvConfigService],
  providers: [EnvConfigService],
})
export class EnvConfigModule extends ConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    return super.forRoot({
      ...options,
      envFilePath: [join(__dirname, `../../../../.env.${process.env.NODE_ENV}`)],
    });
  }
}

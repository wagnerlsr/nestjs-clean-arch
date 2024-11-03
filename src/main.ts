import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // const config = new DocumentBuilder()
  //   .setTitle('NestJS Clean')
  //   .setDescription('NextJS Clean Architect')
  //   .setVersion('1.0')
  //   .build();
  //
  // const document = SwaggerModule.createDocument(app, config);
  //
  // SwaggerModule.setup('api', app, document);

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //   }),
  // );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(3000, '0.0.0.0');
}

bootstrap().then();

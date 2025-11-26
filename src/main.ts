// main.ts (Refinado)

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*', // Origen Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Pipes (Sin cambios)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  // Define los niveles de log según el entorno
  const logLevels =
    process.env.PRODUCTION === 'true'
      ? ['error', 'warn'] // En producción solo errores y alertas
      : ['log', 'error', 'warn', 'debug', 'verbose']; // En desarrollo todo
  app.useLogger(logLevels as any);
  app.setGlobalPrefix('api');

  // Static Assets (Sin cambios)
  const staticAssetsPath = join(process.cwd(), 'uploads');
  app.useStaticAssets(staticAssetsPath, {
    prefix: '/uploads/',
  });

  // Puerto (Sin cambios)
  const port = process.env.PORT || 3000;
  await app.listen(port);

  // Mensaje de inicio
  const logger = new Logger('Bootstrap');
  logger.log(`🚀 Application is running on port: ${port}`);
}
bootstrap();

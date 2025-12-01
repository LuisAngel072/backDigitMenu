// main.ts (Refinado)

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { IoAdapter } from '@nestjs/platform-socket.io';
import helmet from 'helmet';

export class SocketAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    options = options || {};
    options.cors = {
      origin: true,
      methods: ['GET', 'POST'],
      credentials: true,
    };
    const server = super.createIOServer(port, options);
    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(
    helmet({
      // Desactivamos CSP en el backend porque Nginx ya la envía para el HTML.
      // Si la API enviara otra CSP, el navegador se confundiría.
      contentSecurityPolicy: false,

      // Permitimos que recursos de otros dominios (el frontend) carguen cosas de la API
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  app.enableCors({
    origin: true, // Origen Angular
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
      exceptionFactory: (errors) => {
        return new BadRequestException(
          errors.map((err) => ({
            property: err.property,
            constraints: err.constraints,
          })),
        );
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

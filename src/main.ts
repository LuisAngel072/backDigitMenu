// main.ts (Ajuste Final para Prefijo y Socket.IO)

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { IoAdapter } from '@nestjs/platform-socket.io'; // Importar IoAdapter

// Clase personalizada que extiende IoAdapter
export class SocketAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    // Aseguramos que CORS se configure correctamente aquí también,
    // especialmente allowEIO3 por compatibilidad si fuera necesario.
    options.cors = {
      origin: 'http://localhost:4200', // Origen explícito
      methods: ['GET', 'POST'],
      credentials: true,
    };
    // Opcional: Si sospechas problemas con versiones antiguas de clientes
    // options.allowEIO3 = true;

    // Creamos el servidor con las opciones
    const server = super.createIOServer(port, options);
    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //Usar nuestro adaptador personalizado
  app.useWebSocketAdapter(new SocketAdapter(app) as any);

  // Configuración CORS Global (Se mantiene, ayuda con peticiones HTTP normales)
  app.enableCors({
    origin: 'http://localhost:4200',
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

  // Global Prefix (Se mantiene)
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
  logger.log(
    `🔗 WebSocket should be available (check browser network tab for /socket.io/ requests)`,
  );
}
bootstrap();

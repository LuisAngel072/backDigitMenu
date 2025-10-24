import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Mantenemos la transformación para los DTOs
      // Esto evita que el pipe intente convertir implícitamente
      // los parámetros de ruta, que no son DTOs.
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  app.setGlobalPrefix('api');
  const staticAssetsPath = join(process.cwd(), 'uploads');
  console.log(`Intentando servir estáticos desde: ${staticAssetsPath}`); // Log para verificar
  app.useStaticAssets(staticAssetsPath, {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT);
}
bootstrap();

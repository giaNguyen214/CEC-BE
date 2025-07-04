import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN , // CORS_ORIGIN từ .env
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();

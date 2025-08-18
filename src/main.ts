import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['https://cec-chatbot.vercel.app'], // hoặc '*' nếu muốn mở toàn bộ
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'ngrok-skip-browser-warning',
    ],
    credentials: true, // bật nếu FE có dùng cookies/auth
  });
  
  const port = process.env.PORT || 3000;  // lấy PORT từ Render
  await app.listen(port, '0.0.0.0');      // phải bind 0.0.0.0

  console.log('CORS Origin Config:', process.env.CORS_ORIGIN);

}
bootstrap();

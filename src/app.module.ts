import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
console.log('TRƯỚC khi Nest khởi chạy:', process.env.JWT_SECRET);

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,      // hoặc host của superbase
      synchronize: true,      // chỉ nên true trong dev
      entities: [User],
    }),
    AuthModule,
    UsersModule,
    ChatModule,
  ],
})
export class AppModule {
  constructor() {
    console.log('AFTER ConfigModule:', process.env.JWT_SECRET);
  }
}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { Conversation } from './chat-manage/entities/conversation.entity';
import { N8nChatHistory } from './chat-manage/entities/n8n-chat-history.entity';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { ChatManageModule } from './chat-manage/chat-manage.module';
import { PrivateDatabase } from './db-manage/entities/private_database';
import { DBManageModule } from './db-manage/db-manage.module';
import { QaModule } from './qa/qa.module';
import { Qa } from './qa/entities/qa.entity';
import { MinioUploadModule } from './minio-upload/minio-upload.module';
// console.log('TRƯỚC khi Nest khởi chạy:', process.env.JWT_SECRET);

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,      // hoặc host của superbase
      // synchronize: true,      // chỉ nên true trong dev
      entities: [User,Conversation, N8nChatHistory, PrivateDatabase, Qa],
    }),
    AuthModule,
    UsersModule,
    ChatModule,
    ChatManageModule,
    DBManageModule,
    QaModule,
    DBManageModule,
    MinioUploadModule,
  ],
  controllers: [AppController], 
  providers: [AppService],      

})
export class AppModule {
  constructor() {
    console.log('AFTER ConfigModule:', process.env.JWT_SECRET);
  }
}
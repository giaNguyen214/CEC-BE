import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatManageService } from './chat-manage.service';
import { Conversation } from './entities/conversation.entity';
import { N8nChatHistory } from './entities/n8n-chat-history.entity';
import { ChatManageController  } from './chat-manage.controller';
@Module({
    imports: [TypeOrmModule.forFeature([Conversation, N8nChatHistory])],
    controllers: [ChatManageController],
    providers: [ChatManageService],

})
export class ChatManageModule {}

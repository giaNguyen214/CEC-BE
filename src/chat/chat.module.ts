import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { HttpModule } from '@nestjs/axios';
import { GeminiFilterService } from './gemini-filter.service';
@Module({
    imports: [HttpModule],
    controllers: [ChatController],
    providers: [ChatService,  GeminiFilterService],
})
export class ChatModule {}

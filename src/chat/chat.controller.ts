import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {ChatDto } from './dto/send-prompt.dto';
import { ChatService } from './chat.service';
import type { Express } from 'express';
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendPrompt(
    @Body() dto: ChatDto) {
    return this.chatService.handlePrompt(dto.chatInput, dto.selectedFile, dto.sessionId, dto.mssv);
  }
}

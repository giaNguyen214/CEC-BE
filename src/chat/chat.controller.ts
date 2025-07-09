import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SendPromptDto } from './dto/send-prompt.dto';
import { ChatService } from './chat.service';
import type { Express } from 'express';
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file')) // nhận file đính kèm tên "file"
  async sendPrompt(
    @Body() dto: SendPromptDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.chatService.handlePrompt(dto.prompt, file, dto.metadata,dto.sessionId);
  }
}

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { countTokens } from '../utils/token.utils';
import { detectSensitiveContext } from '../utils/context-filter.utils';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { v4 as uuidv4 } from 'uuid';
import { GeminiFilterService } from './gemini-filter.service';
import { ChatDto } from './dto/send-prompt.dto';
import * as FormData from 'form-data';
@Injectable()
export class ChatService {
constructor(private readonly httpService: HttpService,private readonly geminiFilter: GeminiFilterService) {};

private readonly logger = new Logger(ChatService.name);
private readonly TOKEN_LIMIT = 30;

async handlePrompt(chatInput: string, selectedFile: string, sessionId: string, mssv?: string) {
    // console.log('Received chat input:', chatInput);
    // console.log('Received selected file:', selectedFile);
    // console.log('Received session ID:', sessionId);
    // console.log('Received MSSV:', mssv);
    const tokenCount = countTokens(chatInput);
    this.logger.log(`Token count: ${tokenCount}`);
    const finalSessionId = sessionId || uuidv4();
    if (tokenCount > this.TOKEN_LIMIT) {
      throw new BadRequestException(`Prompt quá dài (${tokenCount} tokens), vượt giới hạn ${this.TOKEN_LIMIT}`);
    }

    const detected = detectSensitiveContext(chatInput);
    if (detected.length > 0) {
      throw new BadRequestException({ message:`Prompt chứa nội dung nhạy cảm`
      , violations: detected
      });
    }
    // const aiFilterResult = await this.geminiFilter.filterContentWithAI(chatInput);
    // if (aiFilterResult.hasSensitiveContent) {
    //   throw new BadRequestException({
    //   message: 'Prompt chứa nội dung nhạy cảm',
    //   violations: aiFilterResult.violations,
    // });
//  }
    const startTime = Date.now();
    const response = await this.sendToN8n(chatInput, selectedFile, sessionId, mssv);
    const endTime = Date.now();

    const durationMs = endTime - startTime;
    return response
    // return {
    //     message: 'Prompt hợp lệ',
    //     tokenCount,
    //     startTime: new Date(startTime).toISOString(),
    //     responseTime: `${durationMs} ms`,
    //     chatInput: chatInput,
    //     sessionId: finalSessionId,
    //     mssv: mssv,
    //     selectedFile: selectedFile,
    //     response: response,
    // };

    
}

async sendToN8n(chatInput: string, selectedFile: string, sessionId: string, mssv?: string) {
  const webhookUrl = process.env.WORKFLOW_WEBHOOK_URL;
  // console.log('Gửi prompt đến n8n:', webhookUrl);

  const formData = new FormData();
  formData.append('chatInput', chatInput);
  formData.append('sessionId', sessionId);
  if (mssv) formData.append('mssv', mssv);
  if (selectedFile) formData.append('selectedFile', selectedFile);

  try {
    // console.log('Chat input:', chatInput);
    // console.log('Session ID:', sessionId);
    // console.log('MSSV:', mssv);
    // console.log('Selected file:', selectedFile);
    // console.log('form data:', formData);
    const res = await firstValueFrom(
      this.httpService.post(webhookUrl, formData, {
        headers: formData.getHeaders(),
      }),
    );
    
    return res.data;
  } catch (err) {
    this.logger.error('Lỗi gửi prompt đến n8n', err);
    throw err;
  }
}
}

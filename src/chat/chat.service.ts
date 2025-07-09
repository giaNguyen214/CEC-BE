import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { countTokens } from '../utils/token.utils';
import { detectSensitiveContext } from '../utils/context-filter.utils';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { v4 as uuidv4 } from 'uuid';
import { GeminiFilterService } from './gemini-filter.service';
@Injectable()
export class ChatService {
constructor(private readonly httpService: HttpService,private readonly geminiFilter: GeminiFilterService) {};

private readonly logger = new Logger(ChatService.name);
private readonly TOKEN_LIMIT = 30;

async handlePrompt(prompt: string, file?: Express.Multer.File, metadata?: string, sessionId?: string,) {
  
    const tokenCount = countTokens(prompt);
    this.logger.log(`Token count: ${tokenCount}`);
    const finalSessionId = sessionId || uuidv4();
    if (tokenCount > this.TOKEN_LIMIT) {
      throw new BadRequestException(`Prompt quá dài (${tokenCount} tokens), vượt giới hạn ${this.TOKEN_LIMIT}`);
    }

    const detected = detectSensitiveContext(prompt);
    if (detected.length > 0) {
      throw new BadRequestException({ message:`Prompt chứa nội dung nhạy cảm`
      , violations: detected
      });
    }
    const aiFilterResult = await this.geminiFilter.filterContentWithAI(prompt);
    if (aiFilterResult.hasSensitiveContent) {
      throw new BadRequestException({
      message: 'Prompt chứa nội dung nhạy cảm',
      violations: aiFilterResult.violations,
    });
}
    const startTime = Date.now();
    const response = await this.sendToN8n(prompt,sessionId, metadata);
    const endTime = Date.now(); 

    const durationMs = endTime - startTime;
    return {
        message: 'Prompt hợp lệ',
        tokenCount,
        startTime: new Date(startTime).toISOString(),
        responseTime: `${durationMs} ms`,
        prompt,
        sessionId: finalSessionId,
        file: file?.originalname,
        response: response,
    };

    
}
async sendToN8n(prompt: string, sessionId:string , metadata?: string) {
    const webhookUrl = process.env.WORKFLOW_WEBHOOK_URL; // URL webhook n8n của bạn

    try {
      const res = await firstValueFrom(
        this.httpService.post(webhookUrl, {
          prompt,
          sessionId,
          metadata,
        }),
      );
      return res.data;
    } catch (err) {
      this.logger.error('Lỗi gửi prompt đến n8n', err);
      throw err;
    }
}
}

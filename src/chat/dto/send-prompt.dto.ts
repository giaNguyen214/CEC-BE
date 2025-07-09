import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendPromptDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsOptional()
  @IsString()
  metadata?: string; // optional: thông tin mô tả

  @IsOptional()
  @IsString()
  sessionId?: string;
}

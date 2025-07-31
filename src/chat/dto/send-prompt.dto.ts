import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  @IsNotEmpty()
  chatInput: string;

  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsOptional()
  @IsString()
  selectedFile?: string;

  @IsOptional()
  @IsString()
  mssv?: string;
}


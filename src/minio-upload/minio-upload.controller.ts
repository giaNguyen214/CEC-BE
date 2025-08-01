import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioUploadService } from './minio-upload.service';

@Controller('upload')
export class MinioUploadController {
  constructor(private readonly uploadService: MinioUploadService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handleUpload(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    return this.uploadService.handleFileUpload(file, body.mssv);
  }
}

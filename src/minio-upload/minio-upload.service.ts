import { Injectable, Inject } from '@nestjs/common';
import { MinioService } from './minio.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MinioUploadService {
  constructor(
    private readonly minioService: MinioService,
    @Inject('UPLOAD_SERVICE') private readonly client: ClientProxy,
  ) {}

  async handleFileUpload(file: Express.Multer.File, mssv: string) {
    const result = await this.minioService.uploadFile(file);

    // Gửi event đến RabbitMQ
    this.client.emit('upload_event', {
      fileName: result.fileName,
      url: result.url,
      uploadedAt: new Date().toISOString(),
      mssv: mssv,
    });

    return result;
  }
}

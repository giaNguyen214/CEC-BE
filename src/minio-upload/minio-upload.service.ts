import { Injectable, Inject } from '@nestjs/common';
import { MinioService } from './minio.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MinioUploadService {
  constructor(
    private readonly minioService: MinioService,
    @Inject('UPLOAD_SERVICE') private readonly client: ClientProxy,
  ) {}

  async onModuleInit() {
    try {
      await this.client.connect();
      console.log('✅ RabbitMQ client connected successfully');
    } catch (err) {
      console.error('❌ Failed to connect to RabbitMQ:', err);
    }
  }

  async handleFileUpload(file: Express.Multer.File, mssv: string, filename: string) {
    const result = await this.minioService.uploadFile(file);
    console.log('File uploaded successfully:', result);
    // Gửi event đến RabbitMQ
    this.client.emit('upload_event', {
      fileName: filename,
      url: result.url,
      uploadedAt: new Date().toISOString(),
      mssv: mssv,
    });
    return result;
  }
}

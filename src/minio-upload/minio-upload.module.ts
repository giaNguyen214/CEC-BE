import { Module } from '@nestjs/common';
import { MinioUploadController } from './minio-upload.controller';
import { MinioUploadService } from './minio-upload.service';
import { MinioService } from './minio.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'UPLOAD_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.UPLOAD_QUEUE_NAME || 'upload_queue',
          queueOptions: {
            durable:  false,
          },
        },
      },
    ]),
  ],
  controllers: [MinioUploadController],
  providers: [MinioUploadService, MinioService],
})
export class MinioUploadModule {}

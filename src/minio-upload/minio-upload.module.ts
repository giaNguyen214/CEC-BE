import { Module } from '@nestjs/common';
import { MinioUploadController } from './minio-upload.controller';
import { MinioUploadService } from './minio-upload.service';
import { MinioService } from './minio.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

console.log("env : ", process.env.RABBITMQ_URL, process.env.UPLOAD_QUEUE_NAME);


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'UPLOAD_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ],
          queue: process.env.UPLOAD_QUEUE_NAME,
          
          queueOptions: {
            durable:  true,
          },
        },
      },
    ]),
  ],
  controllers: [MinioUploadController],
  providers: [MinioUploadService, MinioService],
})
export class MinioUploadModule {}

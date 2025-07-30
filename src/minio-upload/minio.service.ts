import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class MinioService {
  private readonly s3: S3Client;
  private readonly bucketName = process.env.MINIO_BUCKET_NAME || 'private-files';

  constructor() {
    this.s3 = new S3Client({
      region:  'us-east-1',
      endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);

    return {
      fileName: file.originalname,
      url: `${process.env.MINIO_ENDPOINT || 'http://localhost:9000'}/${this.bucketName}/${file.originalname}`,
    };
  }
}

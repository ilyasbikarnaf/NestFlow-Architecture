import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import appConfig from 'src/config/app.config';

@Injectable()
export class UploadToAwsProvider {
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
  ) {
    this.s3Client = new S3Client({
      region: this.appConfiguration.awsRegion!,
      credentials: {
        accessKeyId: this.appConfiguration.awsAccessKeyId!,
        secretAccessKey: this.appConfiguration.awsSecretAccessKey!,
      },
    });

    this.bucket = this.appConfiguration.awsBucketName!;
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const key = this.generateFileName(file);

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      return key;
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }

  private generateFileName(file: Express.Multer.File) {
    // get full file name
    let name = file.originalname.split('.')[0];
    // remove all white spaces
    name = name.replace(/\s+/g, '').trim();
    // get the file extension
    const extension = extname(file.originalname);
    // generate the current timestamp
    const timeStamp = new Date().getTime().toString().trim();

    return `${name}-${timeStamp}-${uuidv4()}${extension}`;
  }
}

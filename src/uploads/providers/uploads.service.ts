import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UploadToAwsProvider } from './upload-to-aws';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from '../upload.entity';
import { Repository } from 'typeorm';
import { UploadFile } from '../interfaces/upload-file.interface';
import { fileTypes } from '../enums/file-types.enum';
import { type ConfigType } from '@nestjs/config';
import appConfig from 'src/config/app.config';

@Injectable()
export class UploadsService {
  constructor(
    private readonly uploadToAwsProvider: UploadToAwsProvider,
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    try {
      const supportedMimeTypes = [
        'image/gif',
        'image/jpeg',
        'image/jpg',
        'image/png',
      ];

      if (!supportedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException('Mime type not supported');
      }

      const name = await this.uploadToAwsProvider.uploadFile(file);

      const uploadFile: UploadFile = {
        mime: file.mimetype,
        name,
        path: `https://${this.appConfiguration.awsCloudFrontUrl}/${name}`,
        size: file.size,
        type: fileTypes.IMAGE,
      };

      const upload = this.uploadRepository.create(uploadFile);

      return await this.uploadRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}

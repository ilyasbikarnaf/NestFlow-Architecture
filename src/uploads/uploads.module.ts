import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadToAwsProvider } from './providers/upload-to-aws';
import { UploadsService } from './providers/uploads.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './upload.entity';

@Module({
  controllers: [UploadsController],
  providers: [UploadToAwsProvider, UploadsService],
  imports: [TypeOrmModule.forFeature([Upload])],
})
export class UploadsModule {}

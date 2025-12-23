import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiHeaders, ApiOperation } from '@nestjs/swagger';
import { UploadsService } from './providers/uploads.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enum/auth-type.enum';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @UseInterceptors(FileInterceptor('file'))
  @ApiHeaders([
    {
      name: 'Content-Type',
      description: 'multipart/form-data',
    },
    {
      name: 'Authorization',
      description: 'Bearer Token',
    },
  ])
  @ApiOperation({
    summary: 'Upload a new image to the server',
  })
  @Post('file')
  @Auth(AuthType.None)
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.uploadFile(file);
  }
}

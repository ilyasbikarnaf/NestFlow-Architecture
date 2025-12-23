import { fileTypes } from '../enums/file-types.enum';

export class UploadFile {
  name: string;

  path: string;

  type: fileTypes;

  mime: string;

  size: number;
}

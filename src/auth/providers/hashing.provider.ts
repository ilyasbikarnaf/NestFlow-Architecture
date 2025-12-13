import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
  abstract hashPassword(data: string | Buffer): Promise<string>;

  abstract comparePassword(
    password: string | Buffer,
    encrypted: string,
  ): Promise<boolean>;
}

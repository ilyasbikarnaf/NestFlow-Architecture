import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello to the Nestjs course provided by manik!';
  }
}

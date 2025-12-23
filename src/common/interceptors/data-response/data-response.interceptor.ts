import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { map, Observable } from 'rxjs';
import appConfig from 'src/config/app.config';

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  constructor(
    @Inject(appConfig.KEY)
    private config: ConfigType<typeof appConfig>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        apiVersion: this.config.apiVersion,
        data,
      })),
    );
  }
}

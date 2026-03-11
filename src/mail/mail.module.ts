import { Global, Module } from '@nestjs/common';
import { MailService } from './providers/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Global()
@Module({
  providers: [MailService],
  exports: [MailService],
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get('appConfig.mailtrapHost'),
            secure: false,
            port: 2525,
            auth: {
              user: configService.get('appConfig.smtpUsername'),
              pass: configService.get('appConfig.smtpPassword'),
            },
          },
          defaults: {
            from: `My blog <no-reply@nestjs-blog.com>`,
          },
          template: {
            dir: join(__dirname, './templates'),
            adapter: new EjsAdapter({ inlineCssEnabled: true }),
            options: {
              strict: false,
            },
          },
        };
      },
    }),
  ],
})
export class MailModule {}

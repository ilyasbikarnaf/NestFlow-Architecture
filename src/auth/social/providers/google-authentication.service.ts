import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly usersService: UsersService,

    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    let loginTicket;
    try {
      loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });
    } catch {
      throw new UnauthorizedException('Invalid Google Token');
    }

    const payload = loginTicket.getPayload();

    if (!payload) {
      throw new BadRequestException('Invalid Google Token: No payload found');
    }

    const {
      sub: googleId,
      email,
      given_name: firstName,
      family_name: lastName,
    } = payload;

    const user = await this.usersService.findUserByGoogleId(googleId as string);

    if (user) {
      return await this.generateTokensProvider.generateTokens(user);
    }

    if (!email) {
      throw new BadRequestException('Google User missing email');
    }

    const newUser = await this.usersService.createGoogleUser({
      email,
      firstName: firstName!,
      googleId,
      lastName,
    });

    return await this.generateTokensProvider.generateTokens(newUser);
  }

  onModuleInit() {
    this.oauthClient = new OAuth2Client({
      clientId: this.jwtConfiguration.googleClientId,
      clientSecret: this.jwtConfiguration.googleClientSecret,
    });
  }
}

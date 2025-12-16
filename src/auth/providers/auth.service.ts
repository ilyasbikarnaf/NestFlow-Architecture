import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/sign-in.dto';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { type ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly hashingProvider: HashingProvider,

    private jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  // public login(email: string, password: string, id: number) {
  //   const user = this.usersService.findUserById(id);

  //   return 'SAMPLE_TOKEN';
  // }

  public async signIn(signInDto: SignInDto) {
    let isPasswordCorrect: boolean = false;
    const user = await this.usersService.findUserByEmail(signInDto.email);

    try {
      isPasswordCorrect = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new InternalServerErrorException(error, {
        description: 'Could not compare passwords',
      });
    }

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Incorrect Password');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.acessTokenTtl,
      },
    );

    return { accessToken };
  }

  isAuth() {
    return true;
  }
}

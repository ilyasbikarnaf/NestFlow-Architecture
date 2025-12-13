import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/sign-in.dto';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly hashingProvider: HashingProvider,
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
      throw new RequestTimeoutException(error, {
        description: 'Could not compare passwords',
      });
    }

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Incorrect Password');
    }

    return true;
  }

  isAuth() {
    return true;
  }
}

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersCreateManyProvider } from './users-create-many';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersCreateManyProvider: UsersCreateManyProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser;
    try {
      existingUser = await this.usersRepository.findOneBy({
        email: createUserDto.email,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later',
        { description: 'Error connecting to the database' },
      );
    }

    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email.',
      );
    }

    let newUser = this.usersRepository.create(createUserDto);

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later',
        { description: 'Error connecting to the database' },
      );
    }
    return newUser;
  }

  public async createManyUsers(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createUsers(createManyUsersDto);
  }

  public findAll() {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The API endpoint does not exist',
      },
      HttpStatus.BAD_REQUEST,
      {
        cause: new Error(),
        description: 'Occured because the API endpoint was permanently removed',
      },
    );
  }

  public async findUserById(id: number) {
    let user: User | null;

    try {
      user = await this.usersRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later',
        { description: 'Error connecting to the database' },
      );
    }

    if (!user) {
      throw new BadRequestException('The user id does not exist');
    }

    return user;
  }
}

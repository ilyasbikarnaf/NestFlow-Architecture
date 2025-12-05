import { Injectable } from '@nestjs/common';
import { GetUserParamDto } from 'src/users/dtos/get-user-param.dto';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });

    // if (existingUser) {
    //   return 'user already exists';
    // }

    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);

    return newUser;
  }

  public findAll(
    getUsersParamDto: GetUserParamDto,
    limit: number,
    page: number,
  ) {
    return [
      { firstName: 'John', email: 'john@doe.com' },
      { firstName: 'Alice', email: 'alice@doe.com' },
    ];
  }

  public findUserById(id: string) {
    return {
      id,
      firstName: 'Alice',
      email: 'alice@doe.com',
    };
  }
}

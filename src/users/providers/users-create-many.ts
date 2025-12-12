import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}

  public async createUsers(createManyUsersDto: CreateManyUsersDto) {
    const newUsers: User[] = [];
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later',
        { description: 'Error connecting to the database' },
      );
    }

    try {
      for (const user of createManyUsersDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);

        newUsers.push(result);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complete the transaction', {
        description: String(error),
      });
    } finally {
      try {
        await queryRunner.release();
      } catch (error) {
        // eslint-disable-next-line no-unsafe-finally
        throw new RequestTimeoutException('Could not release the connection', {
          description: String(error),
        });
      }
    }

    return newUsers;
  }
}

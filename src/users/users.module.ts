import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersCreateManyProvider } from './providers/users-create-many';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersCreateManyProvider],
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}

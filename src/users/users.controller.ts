import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { GetUserParamDto } from 'src/users/dtos/get-user-param.dto';
import { PatchUserDto } from 'src/users/dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('{/:id}')
  @ApiOperation({
    summary: 'returns a list of registered users on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched succesfully based on the query',
  })
  @ApiQuery({
    name: 'limit',
    description: 'The number of entries returned per query',
    type: 'number',
    example: 10,
    required: false,
  })
  @ApiQuery({
    name: 'page',
    description:
      'the position of the page number that you want the api to return',
    type: 'number',
    example: '4',
    required: false,
  })
  public getUsers() {
    // @Param() getUsersParamDto: GetUserParamDto,
    // @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    // @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    return this.usersService.findAll();
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('create-many')
  createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
    return this.usersService.createManyUsers(createManyUsersDto);
  }

  @Patch()
  updateUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}

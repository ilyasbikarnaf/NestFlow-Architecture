import { Controller, Get, Post, Param, Body, Patch } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { GetUserParamDto } from 'src/dtos/get-user-param.dto';
import { PatchUserDto } from 'src/dtos/patch-user.dto';

@Controller('users')
export class UsersController {
  @Get('{/:id}')
  public getUsers(@Param() getUsersParamDto: GetUserParamDto) {
    console.log(getUsersParamDto);
    return `You sent a request to get users`;
  }

  @Post()
  createUsers(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return `You setnt sent a post request to users endpoint`;
  }

  @Patch()
  updateUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}

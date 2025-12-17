import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { CreatePostDto } from 'src/posts/dtos/create-post.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PatchPostDto } from './dtos/patch-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { GetPostsDto } from './dtos/get-posts.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { type ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('')
  getAllPosts(@Query() postsQuery: GetPostsDto) {
    console.log(postsQuery);
    return this.postsService.findAll(postsQuery);
  }

  @Get('/:id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findPost(id);
  }

  @ApiOperation({ summary: 'Creates a new blog post' })
  @ApiResponse({
    status: 201,
    description:
      'You get a 201 response when your post was created succesfully',
  })
  @Post()
  createPost(
    @Body() createPostDto: CreatePostDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.postsService.createPost(createPostDto, user);
  }

  @Patch()
  async patchPost(@Body() patchPostDto: PatchPostDto) {
    return await this.postsService.patch(patchPostDto);
  }

  @Delete()
  deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}

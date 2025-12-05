import { Injectable } from '@nestjs/common';
import { CreatePostDto } from 'src/posts/dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/metaOption.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionsRespository: Repository<MetaOption>,
  ) {}

  public async findAll() {
    // const user = this.usersService.findUserById(userId);

    const posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        author: true,
      },
    });

    return posts;
  }

  public async findPost(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: {
        metaOptions: true,
        author: true,
      },
    });

    // console.log(post?.metaOptions?.metaValue);

    return post;
  }

  async createPost(createPostDto: CreatePostDto) {
    const author = await this.usersService.findUserById(createPostDto.authorId);

    if (!author) {
      return;
    }

    const post = this.postsRepository.create({ ...createPostDto, author });

    return await this.postsRepository.save(post);
  }

  async deletePost(id: number) {
    const post = await this.postsRepository.delete(id);

    if (post.affected) {
      return { deleted: true, id };
    }
    return { deleted: false };
  }

  patchPost(patchPostDto: PatchPostDto) {
    console.log(patchPostDto);
  }
}

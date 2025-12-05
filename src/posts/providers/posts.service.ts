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
      relations: { metaOptions: true },
    });

    return posts;
  }

  async createPost(createPostDto: CreatePostDto) {
    const post = this.postsRepository.create(createPostDto);

    return await this.postsRepository.save(post);
  }

  async deletePost(id: number) {
    // find post
    const post = await this.postsRepository.findOneBy({ id });

    if (!post) {
      return { deleted: false, error: 'no post exists' };
    }
    // delete the post first
    await this.postsRepository.delete(id);

    // delete metaoptions of the post
    if (post.metaOptions) {
      await this.metaOptionsRespository.delete(post.metaOptions.id);
    }
    // confirmation message
    await this.postsRepository.delete(id);
    return { deleted: true, id: post.id };
  }

  patchPost(patchPostDto: PatchPostDto) {
    console.log(patchPostDto);
  }
}

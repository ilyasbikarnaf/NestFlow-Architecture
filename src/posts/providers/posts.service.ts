import {
  BadRequestException,
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreatePostDto } from 'src/posts/dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/metaOption.entity';
import { TagsService } from 'src/tags/tags.service';
import { Tag } from 'src/tags/tag.entity';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { User } from 'src/users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionsRespository: Repository<MetaOption>,

    private readonly tagsService: TagsService,

    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async findAll(postsQuery: GetPostsDto): Promise<Paginated<Post>> {
    // console.log(`userId: ${userId}`);
    // const user = userId ? await this.usersService.findUserById(userId);
    const posts = await this.paginationProvider.paginateQuery(
      {
        limit: postsQuery.limit,
        page: postsQuery.page,
      },
      this.postsRepository,
      {
        relations: {
          metaOptions: true,
          author: true,
          tags: true,
        },
      },
    );

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

    return post;
  }

  async createPost(createPostDto: CreatePostDto, user: ActiveUserData) {
    let author: undefined | User = undefined;
    let tags: undefined | Tag[] = undefined;

    try {
      author = await this.usersService.findUserById(user.sub);

      tags = createPostDto.tags
        ? await this.tagsService.findMultipleTags(createPostDto.tags)
        : undefined;
    } catch (error) {
      throw new ConflictException(error);
    }

    if (
      tags &&
      createPostDto.tags &&
      tags.length !== createPostDto.tags.length
    ) {
      throw new BadRequestException('Please check your tag Ids');
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      author,
      tags,
    });

    try {
      return await this.postsRepository.save(post);
    } catch {
      throw new ConflictException('failed to save the post', {
        description: 'Ensure post slug is unique and not a duplicate',
      });
    }
  }

  async deletePost(id: number) {
    const post = await this.postsRepository.delete(id);

    if (post.affected) {
      return { deleted: true, id };
    }
    return { deleted: false };
  }

  async patch(patchPostDto: PatchPostDto) {
    let post: Post | null;
    let tags: Tag[] | null = [];

    if (patchPostDto.tags) {
      try {
        tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
      } catch {
        throw new RequestTimeoutException(
          'Unable to process your request at the moment, please try again later',
        );
      }
    }

    if (!tags || tags.length !== patchPostDto.tags?.length) {
      throw new BadRequestException(
        'Please check your tag Ids and ensure they are correct',
      );
    }

    try {
      post = await this.postsRepository.findOneBy({ id: patchPostDto.id });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later',
        { description: 'Error connecting to the database' },
      );
    }

    if (!post) {
      throw new BadRequestException('The post Id does not exist');
    }

    // Update simple properties
    if (patchPostDto.title !== undefined) post.title = patchPostDto.title;
    if (patchPostDto.content !== undefined) post.content = patchPostDto.content;
    if (patchPostDto.status !== undefined) post.status = patchPostDto.status;
    if (patchPostDto.postType !== undefined)
      post.postType = patchPostDto.postType;
    if (patchPostDto.slug !== undefined) post.slug = patchPostDto.slug;
    if (patchPostDto.featuredImageUrl !== undefined)
      post.featuredImageUrl = patchPostDto.featuredImageUrl;
    if (patchPostDto.publishOn !== undefined)
      post.publishOn = patchPostDto.publishOn;

    post.tags = tags;

    try {
      await this.postsRepository.save(post);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later',
        { description: 'Error connecting to the database' },
      );
    }

    return post;
  }
}

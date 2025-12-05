import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { postType } from '../enums/postType.enum';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/createPostMetaoptions.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { postStatus } from '../enums/postStatus.enum';

export class CreatePostDto {
  @ApiProperty({
    example: 'This is a title',
    description: 'The is the title for the blog post',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(512)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: `possible values are: 'post', 'page', 'story' and 'series'`,
    enum: postType,
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({ description: 'For example: my-url', example: 'my-blog-post' })
  @IsString()
  @MaxLength(256)
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small letters and uses only "-" and without spaces. For example: "my-url"',
  })
  slug: string;

  @ApiProperty({
    enum: postStatus,
    description: `Possible values are: 'draft', 'scheduled', 'review' and 'published'`,
  })
  @IsEnum(postStatus)
  status: postStatus;

  @ApiPropertyOptional({
    description: 'This the content of the post',
    example: 'Post content',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'Serialize you JSON object or else an error will be thrown',
    example: '{\n  "@context": "https://schema.org",\n  "@type": "Person"\n}',
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'Feature image for your blog post',
    example: 'http://localhost.com/images/image1.png',
  })
  @IsUrl()
  @IsOptional()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'The date on which the blog post is published',
    example: '2024-03-16T07:46:32+0000',
  })
  @IsISO8601()
  @IsOptional()
  publishOn?: Date;

  @ApiPropertyOptional({
    description: 'Array of tags passed as string values',
    example: ['nestjs', 'typescript'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags?: string[];

  @ApiPropertyOptional({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        metaValue: {
          type: 'json',
          description: 'the meta value is JSON string',
          example: '{sidebarEnabled: true}',
        },
      },
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto | null;

  @ApiProperty({ type: 'number', example: 1, required: true })
  @IsNotEmpty()
  @IsInt()
  authorId: number;
}

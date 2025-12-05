import { CreatePostDto } from './create-post.dto';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class PatchPostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: 'The ID of the post that needs to be updated',
    example: 123,
  })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  id: number;
}

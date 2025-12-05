import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUserParamDto {
  @ApiPropertyOptional({
    description: 'get user with a specific id',
    example: '1234',
    type: 'number',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}

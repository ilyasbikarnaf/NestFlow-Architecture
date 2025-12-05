import { Injectable } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from '../dtos/createPostMetaoptions.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from '../metaOption.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly MetaOptionsRepository: Repository<MetaOption>,
  ) {}

  async createMetaOptions(createPostMetaOptionsDto: CreatePostMetaOptionsDto) {
    const metaOption = this.MetaOptionsRepository.create(
      createPostMetaOptionsDto,
    );
    return await this.MetaOptionsRepository.save(metaOption);
  }
}

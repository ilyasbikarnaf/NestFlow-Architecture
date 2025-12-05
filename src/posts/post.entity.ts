import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { postType } from './enums/postType.enum';
import { postStatus } from './enums/postStatus.enum';
import { MetaOption } from 'src/meta-options/metaOption.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 512, type: 'varchar', nullable: false })
  title: string;

  @Column({
    type: 'enum',
    enum: postType,
    nullable: false,
    default: postType.POST,
  })
  postType: postType;

  @Column({ length: 256, type: 'varchar', nullable: false, unique: true })
  slug: string;

  @Column({
    type: 'enum',
    enum: postStatus,
    nullable: false,
    default: postStatus.DRAFT,
  })
  status: postStatus;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'text', nullable: true })
  schema?: string;

  @Column({ length: 1024, type: 'varchar', nullable: true })
  featuredImageUrl?: string;

  @Column({ type: 'timestamp', nullable: true })
  publishOn?: Date;

  @OneToOne(() => MetaOption, (metaOptions) => metaOptions.post, {
    cascade: true,
  })
  metaOptions?: MetaOption | null;

  tags?: string[];
}

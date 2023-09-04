import { Column, Entity, OneToMany, BaseEntity, PrimaryColumn } from 'typeorm';
import { InquestKeyword } from './InquestKeyword';

@Entity('inquestCategory')
export class InquestCategory extends BaseEntity {
  @PrimaryColumn('varchar', { length: 100 })
  inquestCategoryId!: string;

  @Column('varchar', { unique: true, length: 255 })
  name!: string;

  @Column('varchar', { nullable: true, length: 255 })
  description!: string | null;

  @OneToMany(() => InquestKeyword, (inquestKeyword) => inquestKeyword.inquestCategory)
  inquestKeywords!: InquestKeyword[];
}

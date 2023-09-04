import { Column, Entity, JoinColumn, ManyToOne, BaseEntity, PrimaryColumn } from 'typeorm';

import { InquestCategory } from './InquestCategory';

@Entity('inquestKeyword')
export class InquestKeyword extends BaseEntity {
  @PrimaryColumn('varchar', { length: 100 })
  inquestKeywordId!: string;

  @Column('varchar', { length: 100 })
  inquestCategoryId!: string;

  @Column('varchar', { unique: true, length: 255 })
  name!: string;

  @Column('varchar', { nullable: true, length: 255 })
  description!: string | null;

  @Column('varchar', { nullable: true, length: 1000 })
  synonyms!: string | null;

  @ManyToOne(() => InquestCategory, (inquestCategory) => inquestCategory.inquestKeywords)
  @JoinColumn({ name: 'inquestCategoryId', referencedColumnName: 'inquestCategoryId' })
  inquestCategory!: InquestCategory;
}

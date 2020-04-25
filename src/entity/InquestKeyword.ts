import { Column, Entity, JoinColumn, ManyToOne, BaseEntity } from 'typeorm';
import { InquestCategory } from './InquestCategory';

@Entity('inquestKeyword')
export class InquestKeyword extends BaseEntity {
  @Column('char', { primary: true, length: 100 })
  inquestKeywordId: string;

  @Column('char', { nullable: true, length: 100 })
  inquestCategoryId: string | null;

  @Column('varchar', { unique: true, length: 255 })
  name: string;

  @Column('varchar', { nullable: true, length: 255 })
  description: string | null;

  @ManyToOne(
    () => InquestCategory,
    inquestCategory => inquestCategory.inquestKeywords
  )
  @JoinColumn({ name: 'inquestCategoryId', referencedColumnName: 'inquestCategoryId' })
  inquestCategory: InquestCategory;
}

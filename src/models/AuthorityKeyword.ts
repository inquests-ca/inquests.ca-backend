import { Column, Entity, JoinColumn, ManyToOne, BaseEntity, PrimaryColumn } from 'typeorm';

import { AuthorityCategory } from './AuthorityCategory';

@Entity('authorityKeyword')
export class AuthorityKeyword extends BaseEntity {
  @PrimaryColumn('char', { length: 100 })
  authorityKeywordId!: string;

  @Column('char', { length: 100 })
  authorityCategoryId!: string;

  @Column('varchar', { unique: true, length: 255 })
  name!: string;

  @Column('varchar', { nullable: true, length: 255 })
  description!: string | null;

  @Column('varchar', { nullable: true, length: 1000 })
  synonyms!: string | null;

  @ManyToOne(() => AuthorityCategory, (authorityCategory) => authorityCategory.authorityKeywords)
  @JoinColumn({ name: 'authorityCategoryId', referencedColumnName: 'authorityCategoryId' })
  authorityCategory!: AuthorityCategory;
}

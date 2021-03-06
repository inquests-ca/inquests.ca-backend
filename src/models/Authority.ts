import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { AuthorityDocument } from './AuthorityDocument';
import { Inquest } from './Inquest';
import { AuthorityKeyword } from './AuthorityKeyword';
import { AuthorityTags } from './AuthorityTags';

@Entity('authority')
export class Authority extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  authorityId!: number;

  @Column('tinyint', { unsigned: true })
  isPrimary!: boolean;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { length: 255 })
  overview!: string;

  @Column('varchar', { length: 5000 })
  synopsis!: string;

  @Column('varchar', { nullable: true, length: 5000 })
  quotes!: string | null;

  @Column('varchar', { nullable: true, length: 1000 })
  notes!: string | null;

  @Column('varchar', { nullable: true, length: 1000 })
  remarks!: string | null;

  @OneToMany(() => AuthorityDocument, (authorityDocument) => authorityDocument.authority)
  authorityDocuments!: AuthorityDocument[];

  @ManyToMany(() => Inquest, (inquest) => inquest.authorities)
  @JoinTable({
    name: 'authorityInquests',
    joinColumn: { name: 'authorityId', referencedColumnName: 'authorityId' },
    inverseJoinColumn: { name: 'inquestId', referencedColumnName: 'inquestId' },
  })
  inquests!: Inquest[];

  @ManyToMany(() => AuthorityKeyword)
  @JoinTable({
    name: 'authorityKeywords',
    joinColumn: { name: 'authorityId', referencedColumnName: 'authorityId' },
    inverseJoinColumn: { name: 'authorityKeywordId', referencedColumnName: 'authorityKeywordId' },
  })
  authorityKeywords!: AuthorityKeyword[];

  @OneToMany(() => AuthorityTags, (authorityTag) => authorityTag.authority)
  authorityTags!: AuthorityTags[];

  @ManyToMany(() => Authority, (authority) => authority.authorityCitedBy)
  @JoinTable({
    name: 'authorityCitations',
    joinColumn: { name: 'authorityId', referencedColumnName: 'authorityId' },
    inverseJoinColumn: { name: 'citedAuthorityId', referencedColumnName: 'authorityId' },
  })
  authorityCitations!: Authority[];

  @ManyToMany(() => Authority, (authority) => authority.authorityCitations)
  @JoinTable({
    name: 'authorityCitations',
    joinColumn: { name: 'citedAuthorityId', referencedColumnName: 'authorityId' },
    inverseJoinColumn: { name: 'authorityId', referencedColumnName: 'authorityId' },
  })
  authorityCitedBy!: Authority[];

  @ManyToMany(() => Authority, (authority) => authority.authorityRelatedBy)
  @JoinTable({
    name: 'authorityRelated',
    joinColumn: { name: 'authorityId', referencedColumnName: 'authorityId' },
    inverseJoinColumn: { name: 'relatedAuthorityId', referencedColumnName: 'authorityId' },
  })
  authorityRelated!: Authority[];

  @ManyToMany(() => Authority, (authority) => authority.authorityRelated)
  @JoinTable({
    name: 'authorityRelated',
    joinColumn: { name: 'relatedAuthorityId', referencedColumnName: 'authorityId' },
    inverseJoinColumn: { name: 'authorityId', referencedColumnName: 'authorityId' },
  })
  authorityRelatedBy!: Authority[];

  @ManyToMany(() => Authority, (authority) => authority.authoritySupercededBy)
  @JoinTable({
    name: 'authoritySuperceded',
    joinColumn: { name: 'authorityId', referencedColumnName: 'authorityId' },
    inverseJoinColumn: { name: 'supercededAuthorityId', referencedColumnName: 'authorityId' },
  })
  authoritySuperceded!: Authority[];

  @ManyToMany(() => Authority, (authority) => authority.authoritySuperceded)
  @JoinTable({
    name: 'authoritySuperceded',
    joinColumn: { name: 'supercededAuthorityId', referencedColumnName: 'authorityId' },
    inverseJoinColumn: { name: 'authorityId', referencedColumnName: 'authorityId' },
  })
  authoritySupercededBy!: Authority[];
}

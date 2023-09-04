import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { AuthorityDocumentType } from './AuthorityDocumentType';
import { Authority } from './Authority';
import { Source } from './Source';
import { AuthorityDocumentLinks } from './AuthorityDocumentLinks';

@Entity('authorityDocument')
export class AuthorityDocument extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  authorityDocumentId!: number;

  @Column('int', { unsigned: true })
  authorityId!: number;

  @Column('varchar', { nullable: true, length: 100 })
  authorityDocumentTypeId!: string | null;

  @Column('varchar', { length: 100 })
  sourceId!: string;

  @Column('tinyint', { unsigned: true })
  isPrimary!: boolean;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { nullable: true, length: 255 })
  citation!: string | null;

  @Column('date', { nullable: true })
  created!: string | null;

  @ManyToOne(() => AuthorityDocumentType)
  @JoinColumn({ name: 'authorityDocumentTypeId', referencedColumnName: 'authorityDocumentTypeId' })
  authorityDocumentType!: AuthorityDocumentType;

  @ManyToOne(() => Authority, (authority) => authority.authorityDocuments)
  @JoinColumn({ name: 'authorityId', referencedColumnName: 'authorityId' })
  authority!: Authority;

  @ManyToOne(() => Source)
  @JoinColumn({ name: 'sourceId', referencedColumnName: 'sourceId' })
  source!: Source;

  @OneToMany(
    () => AuthorityDocumentLinks,
    (authorityDocumentLinks) => authorityDocumentLinks.authorityDocument
  )
  authorityDocumentLinks!: AuthorityDocumentLinks[];
}

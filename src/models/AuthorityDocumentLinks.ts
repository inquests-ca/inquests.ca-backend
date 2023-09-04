import { Column, Entity, JoinColumn, ManyToOne, BaseEntity, PrimaryColumn } from 'typeorm';
import { AuthorityDocument } from './AuthorityDocument';
import { DocumentSource } from './DocumentSource';

@Entity('authorityDocumentLinks')
export class AuthorityDocumentLinks extends BaseEntity {
  @PrimaryColumn('int', { unsigned: true })
  authorityDocumentId!: number;

  @PrimaryColumn('varchar', { length: 100 })
  documentSourceId!: string;

  @Column('varchar', { length: 1000 })
  link!: string;

  @ManyToOne(
    () => AuthorityDocument,
    (authorityDocument) => authorityDocument.authorityDocumentLinks
  )
  @JoinColumn({ name: 'authorityDocumentId', referencedColumnName: 'authorityDocumentId' })
  authorityDocument!: AuthorityDocument;

  @ManyToOne(() => DocumentSource)
  @JoinColumn({ name: 'documentSourceId', referencedColumnName: 'documentSourceId' })
  documentSource!: DocumentSource;
}

import { Column, Entity, JoinColumn, ManyToOne, BaseEntity, PrimaryColumn } from 'typeorm';
import { DocumentSource } from './DocumentSource';
import { InquestDocument } from './InquestDocument';

@Entity('inquestDocumentLinks')
export class InquestDocumentLinks extends BaseEntity {
  @PrimaryColumn('int', { unsigned: true })
  inquestDocumentId!: number;

  @PrimaryColumn('varchar', { length: 100 })
  documentSourceId!: string;

  @Column('varchar', { name: 'link', length: 1000 })
  link!: string;

  @ManyToOne(() => DocumentSource)
  @JoinColumn({ name: 'documentSourceId', referencedColumnName: 'documentSourceId' })
  documentSource!: DocumentSource;

  @ManyToOne(() => InquestDocument, (inquestDocument) => inquestDocument.inquestDocumentLinks)
  @JoinColumn({ name: 'inquestDocumentId', referencedColumnName: 'inquestDocumentId' })
  inquestDocument!: InquestDocument;
}

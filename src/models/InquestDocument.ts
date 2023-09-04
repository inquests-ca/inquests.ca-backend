import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { InquestDocumentType } from './InquestDocumentType';
import { Inquest } from './Inquest';
import { InquestDocumentLinks } from './InquestDocumentLinks';

@Entity('inquestDocument')
export class InquestDocument extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  inquestDocumentId!: number;

  @Column('int', { unsigned: true })
  inquestId!: number;

  @Column('varchar', { nullable: true, length: 100 })
  inquestDocumentTypeId!: string | null;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('date')
  created!: string;

  @ManyToOne(() => InquestDocumentType)
  @JoinColumn({ name: 'inquestDocumentTypeId', referencedColumnName: 'inquestDocumentTypeId' })
  inquestDocumentType!: InquestDocumentType;

  @OneToMany(
    () => InquestDocumentLinks,
    (inquestDocumentLink) => inquestDocumentLink.inquestDocument
  )
  @JoinColumn({ name: 'inquestDocumentTypeId', referencedColumnName: 'inquestDocumentTypeId' })
  inquestDocumentLinks!: InquestDocumentLinks[];

  @ManyToOne(() => Inquest, (inquest) => inquest.inquestDocuments)
  @JoinColumn({ name: 'inquestId', referencedColumnName: 'inquestId' })
  inquest!: Inquest;
}

import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { Authority } from './Authority';
import { Deceased } from './Deceased';
import { Jurisdiction } from './Jurisdiction';
import { InquestDocument } from './InquestDocument';
import { InquestKeyword } from './InquestKeyword';

@Entity('inquest')
export class Inquest extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  inquestId!: number;

  @Column('varchar', { length: 100 })
  jurisdictionId!: string;

  @Column('varchar', { nullable: true, length: 255 })
  location!: string | null;

  @Column('tinyint', { unsigned: true })
  isPrimary!: boolean;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { nullable: true, length: 255 })
  overview!: string | null;

  @Column('varchar', { length: 5000 })
  synopsis!: string;

  @Column('varchar', { nullable: true, length: 1000 })
  notes!: string | null;

  @Column('varchar', { length: 255 })
  presidingOfficer!: string;

  @Column('date')
  start!: string;

  @Column('date', { nullable: true })
  end!: string | null;

  @Column('int', { nullable: true, unsigned: true })
  sittingDays!: number | null;

  @Column('int', { nullable: true, unsigned: true })
  exhibits!: number | null;

  @Column('int', { nullable: true, unsigned: true })
  recommendations!: number | null;

  @Column('varchar', { nullable: true, length: 1000 })
  tags!: string | null;

  @ManyToMany(() => Authority, (authority) => authority.inquests)
  authorities!: Authority[];

  @OneToMany(() => Deceased, (deceased) => deceased.inquest)
  deceased!: Deceased[];

  @ManyToOne(() => Jurisdiction)
  @JoinColumn({ name: 'jurisdictionId', referencedColumnName: 'jurisdictionId' })
  jurisdiction!: Jurisdiction;

  @OneToMany(() => InquestDocument, (inquestDocument) => inquestDocument.inquest)
  inquestDocuments!: InquestDocument[];

  @ManyToMany(() => InquestKeyword)
  @JoinTable({
    name: 'inquestKeywords',
    joinColumn: { name: 'inquestId', referencedColumnName: 'inquestId' },
    inverseJoinColumn: { name: 'inquestKeywordId', referencedColumnName: 'inquestKeywordId' },
  })
  inquestKeywords!: InquestKeyword[];
}

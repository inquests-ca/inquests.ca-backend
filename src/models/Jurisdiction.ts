import {
  Column,
  Entity,
  BaseEntity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('jurisdiction')
export class Jurisdiction extends BaseEntity {
  @PrimaryColumn('varchar', { length: 100 })
  jurisdictionId!: string;

  @Column('varchar', { length: 100 })
  federalJurisdictionId!: string;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { length: 255 })
  code!: string;

  @ManyToOne(() => Jurisdiction)
  @JoinColumn({ name: 'federalJurisdictionId', referencedColumnName: 'jurisdictionId' })
  federalJurisdiction!: Jurisdiction;

  @OneToMany(() => Jurisdiction, (jurisdiction) => jurisdiction.federalJurisdiction)
  jurisdictions!: Jurisdiction[];
}

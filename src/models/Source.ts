import { Column, Entity, JoinColumn, ManyToOne, BaseEntity, PrimaryColumn } from 'typeorm';
import { Jurisdiction } from './Jurisdiction';

@Entity('source')
export class Source extends BaseEntity {
  @PrimaryColumn('varchar', { length: 100 })
  sourceId!: string;

  @Column('varchar', { nullable: true, length: 100 })
  jurisdictionId!: string | null;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { length: 255 })
  code!: string;

  @Column('int', { unsigned: true })
  rank!: number;

  @ManyToOne(() => Jurisdiction)
  @JoinColumn({ name: 'jurisdictionId', referencedColumnName: 'jurisdictionId' })
  jurisdiction!: Jurisdiction;
}

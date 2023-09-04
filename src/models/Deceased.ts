import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

import { DeathCause } from './DeathCause';
import { DeathManner } from './DeathManner';
import { Inquest } from './Inquest';
import { InquestReason } from './InquestReason';

@Entity('deceased')
export class Deceased extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  deceasedId!: number;

  @Column('int', { unsigned: true })
  inquestId!: number;

  @Column('varchar', { length: 100 })
  inquestReasonId!: string;

  @Column('varchar', { length: 100 })
  deathMannerId!: string;

  @Column('varchar', { length: 100 })
  deathCauseId!: string;

  @Column('varchar', { length: 255 })
  deathCause!: string;

  @Column('date')
  deathDate!: string;

  @Column('varchar', { nullable: true, length: 255 })
  deathLocation!: string | null;

  @Column('varchar', { nullable: true, length: 255 })
  lastName!: string | null;

  @Column('varchar', { nullable: true, length: 255 })
  givenNames!: string | null;

  @Column('int', { nullable: true, unsigned: true })
  age!: number | null;

  @Column('varchar', { nullable: true, length: 255 })
  ageUnit!: string | null;

  @Column('varchar', { nullable: true, length: 255 })
  sex!: string | null;

  @ManyToOne(() => DeathManner)
  @JoinColumn({ name: 'deathMannerId', referencedColumnName: 'deathMannerId' })
  deathManner!: DeathManner;

  @ManyToOne(() => DeathCause)
  @JoinColumn({ name: 'deathCauseId', referencedColumnName: 'deathCauseId' })
  deathCauseModel!: DeathCause;

  @ManyToOne(() => Inquest, (inquest) => inquest.deceased)
  @JoinColumn({ name: 'inquestId', referencedColumnName: 'inquestId' })
  inquest!: Inquest;

  @ManyToOne(() => InquestReason)
  @JoinColumn({ name: 'inquestReasonId', referencedColumnName: 'inquestReasonId' })
  inquestReason!: InquestReason;
}

import { Column, Entity, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity('deathCause')
export class DeathCause extends BaseEntity {
  @PrimaryColumn('char', { length: 100 })
  deathCauseId!: string;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { nullable: true, length: 1000 })
  description!: string | null;

  @Column('varchar', { nullable: true, length: 1000 })
  synonyms!: string | null;
}

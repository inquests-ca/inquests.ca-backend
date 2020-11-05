import { Column, Entity, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity('deathManner')
export class DeathManner extends BaseEntity {
  @PrimaryColumn('char', { length: 100 })
  deathMannerId!: string;

  @Column('varchar', { length: 255 })
  name!: string;
}

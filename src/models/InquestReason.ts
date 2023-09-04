import { Column, Entity, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity('inquestReason')
export class InquestReason extends BaseEntity {
  @PrimaryColumn('char', { length: 100 })
  inquestReasonId!: string;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('tinyint', { unsigned: true })
  isMandatory!: boolean;
}

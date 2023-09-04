import { Column, Entity, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity('documentSource')
export class DocumentSource extends BaseEntity {
  @PrimaryColumn('varchar', { length: 100 })
  documentSourceId!: string;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('tinyint', { unsigned: true })
  isFree!: boolean;
}

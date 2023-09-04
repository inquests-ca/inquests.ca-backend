import { Column, Entity, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity('inquestDocumentType')
export class InquestDocumentType extends BaseEntity {
  @PrimaryColumn('varchar', { length: 100 })
  inquestDocumentTypeId!: string;

  @Column('varchar', { name: 'name', length: 255 })
  name!: string;

  @Column('varchar', { nullable: true, length: 255 })
  description!: string | null;
}

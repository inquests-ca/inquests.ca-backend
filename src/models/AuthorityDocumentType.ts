import { Column, Entity, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity('authorityDocumentType')
export class AuthorityDocumentType extends BaseEntity {
  @PrimaryColumn('varchar', { length: 100 })
  authorityDocumentTypeId!: string;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { nullable: true, length: 255 })
  description!: string | null;
}

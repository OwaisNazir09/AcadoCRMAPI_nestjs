import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InstitutionGroup } from './institution-group.entity';

@Entity('institute_group_mappings')
export class InstituteGroupMapping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

 @Column({ name: 'institute_id' })
  instituteId: string;

  @Column({ name: 'created_by_id' })
  createdById: string;

  @ManyToOne(() => InstitutionGroup, (group) => group.mappings, {
    onDelete: 'CASCADE',
  })
  group: InstitutionGroup;
}

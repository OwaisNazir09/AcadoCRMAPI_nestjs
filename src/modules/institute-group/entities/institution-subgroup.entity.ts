import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InstitutionGroup } from './institution-group.entity';

@Entity('institution_sub_groups')
export class InstitutionSubGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sub_group_name' })
  subGroupName: string;

  @ManyToOne(() => InstitutionGroup, (group) => group.subGroups, {
    onDelete: 'CASCADE',
  })
  group: InstitutionGroup;
}

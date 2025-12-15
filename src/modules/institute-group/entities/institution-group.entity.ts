import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InstituteGroupMapping } from './institute-group-mapping.entity';
import { InstitutionSubGroup } from './institution-subgroup.entity';

@Entity('institution_groups')
export class InstitutionGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'group_name' })
  groupName: string;

  @Column({ name: 'group_description', nullable: true })
  groupDescription: string;

  @Column({ name: 'created_by_id', type: 'uuid' })
  createdById: string;  
  
  @Column({ name: 'user_id', nullable: true, type: 'uuid' })
  userId: string | null;

  @OneToMany(() => InstituteGroupMapping, (mapping) => mapping.group)
  mappings: InstituteGroupMapping[];

  @OneToMany(() => InstitutionSubGroup, (sub) => sub.group, {
    cascade: true,
  })
  subGroups: InstitutionSubGroup[];
}

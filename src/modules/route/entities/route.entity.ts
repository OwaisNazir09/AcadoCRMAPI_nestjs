import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
} from 'typeorm';

import { RouteGroup } from './route-group.entity';
import { Role } from '../../role/entities/role.entity';


@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Role, (role) => role.routes)
roles: Role[];


  @Column()
  path: string;

  @ManyToOne(() => RouteGroup, (group) => group.children, {
    onDelete: 'CASCADE',
  })
  group: RouteGroup;
}

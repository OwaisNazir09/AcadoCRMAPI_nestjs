import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Route } from './route.entity';
import { Role } from '../../role/entities/role.entity';

@Entity('route_groups')
export class RouteGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  icon: string;

  @OneToMany(() => Route, (route) => route.group, { cascade: true })
  children: Route[];

  @ManyToMany(() => Role, (role) => role.routeGroups)
  roles: Role[];
}

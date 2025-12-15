import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { RouteGroup } from '../../route/entities/route-group.entity';
import { Route } from '../../route/entities/route.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  roleName: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => RouteGroup, (group) => group.roles)
  @JoinTable({
    name: 'role_route_groups',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'route_group_id' },
  })
  routeGroups: RouteGroup[];

  @ManyToMany(() => Route, (route) => route.roles)
  @JoinTable({
    name: 'role_routes',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'route_id' },
  })
  routes: Route[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Action } from './action.entity';

@Entity('modules')
export class Modules {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  routeBase: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  updatedBy: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Action, action => action.module, { cascade: true })
  actions: Action[];
}

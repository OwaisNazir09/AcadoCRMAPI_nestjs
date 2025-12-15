import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Modules } from './module.entity';

@Entity('actions')
export class Action {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  method: string;

  @Column()
  route: string;

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

  @ManyToOne(() => Modules, module => module.actions, {
    onDelete: 'CASCADE',
  })
  module: Modules;
}

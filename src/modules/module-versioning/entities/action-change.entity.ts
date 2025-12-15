import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ModuleChange } from './module-change.entity';

@Entity('action_changes')
export class ActionChange {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  actionId: string;

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

  @Column()
  changeType: string;

  @Column({ nullable: true })
  remarks: string;

  @ManyToOne(() => ModuleChange, (m) => m.actions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'module_id' })
  module: ModuleChange;
}

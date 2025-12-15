import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ModuleVersion } from './module-version.entity';
import { ActionChange } from './action-change.entity';

@Entity('module_changes')
export class ModuleChange {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  moduleId: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  routeBase: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  changeType: string;

  @Column({ nullable: true })
  remarks: string;

  @ManyToOne(() => ModuleVersion, (v) => v.modules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'version_id' })
  version: ModuleVersion;

  @OneToMany(() => ActionChange, (a) => a.module, {
    cascade: true,
  })
  actions: ActionChange[];
}

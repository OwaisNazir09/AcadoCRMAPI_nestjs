import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import { PackageModule } from './package-module.entity';
import { Action } from '../../modules-and-action/entities/action.entity';

@Entity('package_module_actions')
export class PackageModuleAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PackageModule, (pm) => pm.actions, { onDelete: 'CASCADE' })
  @JoinColumn()
  packageModule: PackageModule;

  @ManyToOne(() => Action, { eager: true })
  @JoinColumn()
  action: Action;
}

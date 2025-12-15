import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
  JoinColumn
} from 'typeorm';

import { Package } from './packages.entity';
import { Modules } from '../../modules-and-action/entities/module.entity';
import { PackageModuleAction } from './package-action.entity';

@Entity('package_modules')
export class PackageModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Package, (p) => p.modules, { onDelete: 'CASCADE' })
  @JoinColumn()
  package: Package;

  @ManyToOne(() => Modules, { eager: true })
  @JoinColumn()
  module: Modules;

  @Column({ default: false })
  fullModule: boolean;

  @OneToMany(() => PackageModuleAction, (pma) => pma.packageModule, {
    cascade: true,
  })
  actions: PackageModuleAction[];
}

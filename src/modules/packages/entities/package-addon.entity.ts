import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import { Package } from './packages.entity';
import { Addon } from './addon.entity';

@Entity('package_addons')
export class PackageAddon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Package, (p) => p.addons, { onDelete: 'CASCADE' })
  @JoinColumn()
  package: Package;

  @ManyToOne(() => Addon, { eager: true })
  @JoinColumn()
  addon: Addon;
}

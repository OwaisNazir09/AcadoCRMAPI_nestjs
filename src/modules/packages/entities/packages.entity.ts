import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn
} from 'typeorm';

import { PackageModule } from './package-module.entity';
import { PackageAddon } from './package-addon.entity';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  basePrice: number;

  @Column({ type: 'int', default: 0 })
  totalPrice: number;

  @OneToMany(() => PackageModule, (pm) => pm.package, { cascade: true })
  modules: PackageModule[];

  @OneToMany(() => PackageAddon, (pa) => pa.package, { cascade: true })
  addons: PackageAddon[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  createdBy: string;
}

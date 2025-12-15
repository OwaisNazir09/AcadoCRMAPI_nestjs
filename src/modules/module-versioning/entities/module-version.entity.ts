import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ModuleChange } from './module-change.entity';

@Entity('module_versions')
export class ModuleVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  version: string;

  @Column()
  releasedBy: string;

  @Column({ type: 'timestamptz' })
  releasedAt: Date;

  @Column({ nullable: true })
  remarks: string;

  @OneToMany(() => ModuleChange, (m) => m.version, {
    cascade: true,
  })
  modules: ModuleChange[];
}

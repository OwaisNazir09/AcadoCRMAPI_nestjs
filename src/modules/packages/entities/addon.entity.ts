import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('addons')
export class Addon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;
}

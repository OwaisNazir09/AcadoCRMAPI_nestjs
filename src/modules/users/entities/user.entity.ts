import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({
    name: 'user_uuid',
    type: 'uuid',
    unique: true,
    default: () => 'gen_random_uuid()',
  })
  userUuid: string;

  @Column({ name: 'email', type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;

  @Column({ 
      name: 'user_type', 
      type: 'varchar', 
      length: 50, 
      default: 'system',
  })
  userType: string;

  @Column({
    name: 'mapped_id',
    type: 'uuid',
    nullable: true,
  })
  mappedId: string;

  @Column({
    name: 'role_id',
    type: 'uuid',
    nullable: true,
  })
  roleId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('system_users')
export class SystemUser {
  @PrimaryGeneratedColumn('uuid', { name: 'system_user_id' })
  systemUserId: string;

  @Column({ name: 'full_name', type: 'varchar', length: 150 })
  fullName: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20 })
  phoneNumber: string;

  @Column({ name: 'role_id', type: 'uuid', nullable: true })
  roleId: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}

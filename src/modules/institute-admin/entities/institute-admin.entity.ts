import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('institute_admins')
export class InstituteAdmin {
  @PrimaryGeneratedColumn('uuid', { name: 'institute_admin_id' })
  instituteAdminId: string;

  @Column({ name: 'institute_id', type: 'uuid' })
  instituteId: string;

  @Column({ name: 'full_name', type: 'varchar', length: 150 })
  fullName: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20 })
  phoneNumber: string;

  @Column({ name: 'email', type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}

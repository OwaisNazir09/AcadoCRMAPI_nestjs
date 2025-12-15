import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('partners')
export class Partner {
  @PrimaryGeneratedColumn('uuid', { name: 'partner_id' })
  partnerId: string;

  @Column({ name: 'company_name', type: 'varchar', length: 150 })
  companyName: string;

  @Column({ name: 'contact_person', type: 'varchar', length: 150 })
  contactPerson: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20 })
  phoneNumber: string;

  @Column({ name: 'email', type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}

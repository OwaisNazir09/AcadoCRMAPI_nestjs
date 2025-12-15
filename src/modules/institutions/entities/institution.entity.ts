import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('institutes')
export class Institute {

  @PrimaryGeneratedColumn('uuid', { name: 'institute_id' })
  instituteId: string;

  @Column({
    name: 'institute_uuid',
    type: 'uuid',
    default: () => 'gen_random_uuid()',
  })
  instituteUuid: string;

  @Column({ name: 'institute_prefix', nullable: true })
  institutePrefix: string;

  @Column({ name: 'institute_name' })
  instituteName: string;

  @Column({ name: 'institute_address', nullable: true })
  instituteAddress: string;

  @Column({ name: 'institute_about', type: 'text', nullable: true })
  instituteAbout: string;

  @Column({ name: 'institute_contact_number', nullable: true })
  instituteContactNumber: string;

  @Column({ name: 'institute_email', nullable: true })
  instituteEmail: string;

  @Column({ name: 'institute_website', nullable: true })
  instituteWebsite: string;

  @Column({ name: 'institute_domain', nullable: true })
  instituteDomain: string;

  // PRIMARY CONTACT
  @Column({ name: 'primary_contact_person', nullable: true })
  primaryContactPerson: string;

  @Column({ name: 'primary_contact_designation', nullable: true })
  primaryContactDesignation: string;

  @Column({ name: 'primary_contact_phone', nullable: true })
  primaryContactPhone: string;

  @Column({ name: 'primary_contact_email', nullable: true })
  primaryContactEmail: string;

  // SUPPORT TEAM
  @Column({ name: 'support_contact_person', nullable: true })
  supportContactPerson: string;

  @Column({ name: 'support_contact_designation', nullable: true })
  supportContactDesignation: string;

  @Column({ name: 'support_phone', nullable: true })
  supportPhone: string;

  @Column({ name: 'support_email', nullable: true })
  supportEmail: string;

  @Column({ name: 'support_whatsapp_number', nullable: true })
  supportWhatsappNumber: string;

  @Column({ name: 'institute_type', nullable: true })
  instituteType: string;

  @Column({ name: 'institute_group_id', type: 'uuid', nullable: true })
  instituteGroupId: string;

  @Column({ name: 'institute_subgroup_id', type: 'uuid', nullable: true })
  instituteSubGroupId: string;

  @Column({ name: 'institute_user_id', type: 'uuid' })
  instituteUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'institute_user_id', referencedColumnName: 'userUuid' })
  owner: User;

  @Column({ name: 'institute_created_by_id', type: 'uuid', nullable: true })
  instituteCreatedById: string | null;
  
@Column({
  name: 'is_active',
  type: 'boolean',
  default: true,
})
isActive: boolean;

@Column({
  name: 'is_suspended',
  type: 'boolean',
  default: false,
})
isSuspended: boolean;

@Column({
  name: 'is_verified',
  type: 'boolean',
  default: false,
})
isVerified: boolean;

@Column({
  name: 'is_deleted',
  type: 'boolean',
  default: false,
})
isDeleted: boolean;

@Column({
  name: 'status',
  type: 'varchar',
  length: 50,
  default: 'ACTIVE',   
})
status: string;



  @ManyToOne(() => User)
  @JoinColumn({
    name: 'institute_created_by_id',
    referencedColumnName: 'userUuid'
  })
  createdBy: User;

  @Column({ name: 'institute_updated_by_id', type: 'uuid', nullable: true })
  instituteUpdatedById: string | null;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'institute_updated_by_id',
    referencedColumnName: 'userUuid'
  })
  updatedBy: User;
}

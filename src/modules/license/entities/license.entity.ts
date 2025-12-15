import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('licenses')
export class License {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column()
  customerId: string;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column({ nullable: true })
  institutionId: string;

  @Column({ nullable: true })
  institutionName: string;

  @Column()
  packageId: string;

  @Column({ nullable: true })
  packageName: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'active', 'expired', 'revoked', 'suspended'],
    default: 'pending'
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  validFrom: Date;

  @Column({ type: 'timestamp', nullable: true })
  validTill: Date;

  @Column({ type: 'timestamp', nullable: true })
  activatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  renewedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  revokedAt: Date;

  @Column({ nullable: true })
  revokedReason: string;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ default: false })
  isTrial: boolean;

  @Column({ type: 'int', default: 0 })
  maxUsers: number;

  @Column({ type: 'int', default: 0 })
  currentUsers: number;

  @Column({ nullable: true })
  licenseKey: string;

  daysRemaining?: number;
  isExpired?: boolean;
}
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan, MoreThan } from 'typeorm';
import { License } from './entities/license.entity';
import { CreateLicenseDto } from './dto/create-license.dto';
import { AssignLicenseDto } from './dto/assign-license.dto';
import { RenewLicenseDto } from './dto/renew-license.dto';
import { RevokeLicenseDto } from './dto/revoke-license.dto';
import { Package } from '../packages/entities/packages.entity';

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License)
    private readonly licenseRepo: Repository<License>,
    
    @InjectRepository(Package)
    private readonly packageRepo: Repository<Package>,
  ) {}

  /* -------------------------------------------
        CREATE LICENSE
  -------------------------------------------- */

  async createLicense(dto: CreateLicenseDto, adminId: string) {
    // Check package
    const pack = await this.packageRepo.findOne({
      where: { id: dto.packageId },
    });

    if (!pack) throw new NotFoundException('Package not found');

    // Check for existing pending/active license
    const existingLicense = await this.licenseRepo.findOne({
      where: { 
        customerId: dto.customerId,
        packageId: dto.packageId,
        status: In(['pending', 'active'])
      },
    });

    if (existingLicense) {
      throw new BadRequestException('Customer already has a license for this package');
    }

    // Generate license key
    const licenseKey = this.generateLicenseKey();

    const license = this.licenseRepo.create({
      ...dto,
      packageName: pack.name,
      licenseKey,
      status: 'pending',
      isTrial: dto.isTrial || false,
      maxUsers: dto.maxUsers || 1,
      currentUsers: 0,
      createdBy: adminId,
    });

    return this.licenseRepo.save(license);
  }

  /* -------------------------------------------
        ASSIGN LICENSE TO INSTITUTION
  -------------------------------------------- */

  async assignLicense(licenseId: string, dto: AssignLicenseDto) {
    const license = await this.licenseRepo.findOne({
      where: { id: licenseId },
    });

    if (!license) throw new NotFoundException('License not found');

    if (license.status !== 'pending') {
      throw new BadRequestException('License must be in pending status to assign');
    }

    // Check if institution already has an active license
    const existingActiveLicense = await this.licenseRepo.findOne({
      where: { 
        institutionId: dto.institutionId,
        status: 'active'
      },
    });

    if (existingActiveLicense) {
      throw new BadRequestException('Institution already has an active license');
    }

    const now = new Date();
    const durationDays = license.isTrial ? 30 : 365; 

    license.institutionId = dto.institutionId;
    license.institutionName = dto.institutionName;
    license.status = 'active';
    license.validFrom = now;
    license.validTill = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
    license.activatedAt = now;

    return this.licenseRepo.save(license);
  }

  /* -------------------------------------------
        GET LICENSES
  -------------------------------------------- */

  async getAllLicenses(filters?: {
    status?: string;
    customerId?: string;
    institutionId?: string;
    isTrial?: boolean;
  }) {
    const queryBuilder = this.licenseRepo.createQueryBuilder('license');
    
    if (filters?.status) {
      queryBuilder.andWhere('license.status = :status', { status: filters.status });
    }
    if (filters?.customerId) {
      queryBuilder.andWhere('license.customerId = :customerId', { customerId: filters.customerId });
    }
    if (filters?.institutionId) {
      queryBuilder.andWhere('license.institutionId = :institutionId', { institutionId: filters.institutionId });
    }
    if (filters?.isTrial !== undefined) {
      queryBuilder.andWhere('license.isTrial = :isTrial', { isTrial: filters.isTrial });
    }
    
    queryBuilder.orderBy('license.createdAt', 'DESC');

    const licenses = await queryBuilder.getMany();

    // Add calculated fields
    return licenses.map(license => this.enrichLicenseData(license));
  }

  async getLicenseById(id: string) {
    const license = await this.licenseRepo.findOne({
      where: { id },
    });

    if (!license) throw new NotFoundException('License not found');
    
    return this.enrichLicenseData(license);
  }

  async getLicenseByKey(licenseKey: string) {
    const license = await this.licenseRepo.findOne({
      where: { licenseKey },
    });

    if (!license) throw new NotFoundException('License not found');
    
    return this.enrichLicenseData(license);
  }

  async getLicensesByCustomer(customerId: string) {
    const licenses = await this.licenseRepo.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
    
    return licenses.map(license => this.enrichLicenseData(license));
  }

  async getLicenseByInstitution(institutionId: string) {
    const license = await this.licenseRepo.findOne({
      where: { 
        institutionId,
        status: In(['active', 'expired'])
      },
      order: { createdAt: 'DESC' },
    });
    
    return license ? this.enrichLicenseData(license) : null;
  }

  /* -------------------------------------------
        LICENSE OPERATIONS
  -------------------------------------------- */

  async renewLicense(licenseId: string, dto: RenewLicenseDto) {
    const license = await this.licenseRepo.findOne({
      where: { id: licenseId },
    });

    if (!license) throw new NotFoundException('License not found');
    
    if (!['active', 'expired'].includes(license.status)) {
      throw new BadRequestException('Only active or expired licenses can be renewed');
    }

    const currentValidTill = license.validTill || new Date();
    license.validTill = new Date(currentValidTill.getTime() + dto.extensionDays * 24 * 60 * 60 * 1000);
    license.status = 'active';
    license.renewedAt = new Date();
    
    if (dto.notes) {
      license.notes = license.notes ? `${license.notes}\nRenewed: ${dto.notes}` : `Renewed: ${dto.notes}`;
    }

    const savedLicense = await this.licenseRepo.save(license);
    return this.enrichLicenseData(savedLicense);
  }

  async revokeLicense(licenseId: string, dto: RevokeLicenseDto) {
    const license = await this.licenseRepo.findOne({
      where: { id: licenseId },
    });

    if (!license) throw new NotFoundException('License not found');
    
    license.status = 'revoked';
    license.revokedAt = new Date();
    license.revokedReason = dto.reason;
    
    if (dto.notes) {
      license.notes = license.notes ? `${license.notes}\nRevoked: ${dto.notes}` : `Revoked: ${dto.notes}`;
    }

    const savedLicense = await this.licenseRepo.save(license);
    return this.enrichLicenseData(savedLicense);
  }

  async suspendLicense(licenseId: string, reason: string) {
    const license = await this.licenseRepo.findOne({
      where: { id: licenseId },
    });

    if (!license) throw new NotFoundException('License not found');
    
    license.status = 'suspended';
    
    if (reason) {
      license.notes = license.notes ? `${license.notes}\nSuspended: ${reason}` : `Suspended: ${reason}`;
    }

    const savedLicense = await this.licenseRepo.save(license);
    return this.enrichLicenseData(savedLicense);
  }

  async activateLicense(licenseId: string) {
    const license = await this.licenseRepo.findOne({
      where: { id: licenseId },
    });

    if (!license) throw new NotFoundException('License not found');
    
    if (license.status !== 'suspended') {
      throw new BadRequestException('Only suspended licenses can be activated');
    }

    license.status = 'active';
    const savedLicense = await this.licenseRepo.save(license);
    return this.enrichLicenseData(savedLicense);
  }

  /* -------------------------------------------
        UTILITY METHODS
  -------------------------------------------- */

  private generateLicenseKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = [4, 4, 4, 4]; // Format: XXXX-XXXX-XXXX-XXXX
    const key = segments.map(seg => {
      let segment = '';
      for (let i = 0; i < seg; i++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return segment;
    }).join('-');
    
    return key;
  }

  private enrichLicenseData(license: License): License {
    const enriched = { ...license };
    
    if (enriched.validTill) {
      const now = new Date();
      const validTill = new Date(enriched.validTill);
      const diffTime = validTill.getTime() - now.getTime();
      enriched.daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      enriched.isExpired = diffTime < 0;
      
      // Auto-update status if expired
      if (enriched.isExpired && enriched.status === 'active') {
        enriched.status = 'expired';
        // Auto-save the status update
        this.licenseRepo.update(enriched.id, { status: 'expired' });
      }
    }
    
    return enriched;
  }

  async checkExpiredLicenses() {
    const now = new Date();
    const expiredLicenses = await this.licenseRepo.find({
      where: {
        status: 'active',
        validTill: LessThan(now),
      },
    });

    if (expiredLicenses.length > 0) {
      expiredLicenses.forEach(license => {
        license.status = 'expired';
      });
      await this.licenseRepo.save(expiredLicenses);
    }

    return expiredLicenses.length;
  }

  async getExpiringLicenses(daysThreshold: number = 7) {
    const now = new Date();
    const thresholdDate = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);

    const licenses = await this.licenseRepo.createQueryBuilder('license')
      .where('license.status = :status', { status: 'active' })
      .andWhere('license.validTill > :now', { now })
      .andWhere('license.validTill < :threshold', { threshold: thresholdDate })
      .getMany();

    return licenses.map(license => this.enrichLicenseData(license));
  }

  /* -------------------------------------------
        USER MANAGEMENT
  -------------------------------------------- */

  async addUserToLicense(licenseId: string) {
    const license = await this.licenseRepo.findOne({
      where: { id: licenseId },
    });

    if (!license) throw new NotFoundException('License not found');
    
    if (license.currentUsers >= license.maxUsers) {
      throw new BadRequestException('Maximum user limit reached');
    }

    license.currentUsers += 1;
    return this.licenseRepo.save(license);
  }

  async removeUserFromLicense(licenseId: string) {
    const license = await this.licenseRepo.findOne({
      where: { id: licenseId },
    });

    if (!license) throw new NotFoundException('License not found');
    
    if (license.currentUsers > 0) {
      license.currentUsers -= 1;
      return this.licenseRepo.save(license);
    }

    return license;
  }
}
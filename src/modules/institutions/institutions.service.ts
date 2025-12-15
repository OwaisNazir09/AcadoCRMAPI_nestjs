import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Institute } from './entities/institution.entity';

import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionsService {
  constructor(
    @InjectRepository(Institute)
    private readonly institutionRepo: Repository<Institute>,
  ) {}

  // ============================================================
  // CREATE
  // ============================================================
  async create(dto: CreateInstitutionDto, user: any) {
    const userType = (user.userType || '').toLowerCase();

    // Allowed roles
    if (!['admin', 'partner', 'institute_admin'].includes(userType)) {
      throw new ForbiddenException(
        'You are not allowed to create institutions.',
      );
    }

    // Created by
    dto.instituteCreatedById = user.uuid;

    // If ADMIN or PARTNER:
    // They MUST specify instituteUserId (owner)
    if (['admin', 'partner'].includes(userType)) {
      if (!dto.instituteUserId) {
        throw new ForbiddenException(
          'instituteUserId is required for ADMIN/PARTNER creation'
        );
      }
    }

    // Institute Admin → assign themselves
    if (userType === 'institute_admin') {
      dto.instituteUserId = user.uuid;
    }

    const inst = this.institutionRepo.create(dto);
    return await this.institutionRepo.save(inst);
  }

  // ============================================================
  // FIND ALL
  // ============================================================
  async findAll(user: any) {
    const userType = (user.userType || '').toLowerCase();

    // admin sees everything
    if (userType === 'admin') {
      return await this.institutionRepo.find({
        order: { instituteId: 'DESC' },
      });
    }

    // partner → sees what he created
    if (userType === 'partner') {
      return await this.institutionRepo.find({
        where: { instituteCreatedById: user.uuid },
        order: { instituteId: 'DESC' },
      });
    }

    // institute_admin → sees only their institute
    if (userType === 'institute_admin') {
      return await this.institutionRepo.find({
        where: { instituteUserId: user.uuid },
        order: { instituteId: 'DESC' },
      });
    }

    // normal user → no access
    throw new ForbiddenException('Users cannot access institutions.');
  }

  // ============================================================
  // FIND ONE (by UUID)
  // ============================================================
  async findOne(id: string) {
    const inst = await this.institutionRepo.findOne({
      where: { instituteUuid: id },
    });

    if (!inst) throw new NotFoundException('Institution not found');

    return inst;
  }

  // ============================================================
  // UPDATE
  // ============================================================
  async update(id: string, dto: UpdateInstitutionDto, user: any) {
    const inst = await this.findOne(id);
    const userType = (user.userType || '').toLowerCase();

    // ADMIN → full access
    if (userType === 'admin') {
      dto.instituteUpdatedById = user.uuid;
      Object.assign(inst, dto);
      return await this.institutionRepo.save(inst);
    }

    // PARTNER → can update only what they created
    if (userType === 'partner') {
      if (inst.instituteCreatedById !== user.uuid) {
        throw new ForbiddenException('You cannot update this institution');
      }
    }

    // INSTITUTE ADMIN → can update only their institute
    if (userType === 'institute_admin') {
      if (inst.instituteUserId !== user.uuid) {
        throw new ForbiddenException('You cannot update this institution');
      }
    }

    // USER → no access
    if (userType === 'user') {
      throw new ForbiddenException('Users cannot update institutions.');
    }

    dto.instituteUpdatedById = user.uuid;
    Object.assign(inst, dto);
    return this.institutionRepo.save(inst);
  }

  // ============================================================
  // DELETE
  // ============================================================
  async remove(id: string, user: any) {
    const inst = await this.findOne(id);
    const userType = (user.userType || '').toLowerCase();

    // admin → full access
    if (userType === 'admin') {
      return await this.institutionRepo.remove(inst);
    }

    // partner → delete only created
    if (userType === 'partner') {
      if (inst.instituteCreatedById !== user.uuid) {
        throw new ForbiddenException('You cannot delete this institution.');
      }
    }

    // institute_admin → delete only owned
    if (userType === 'institute_admin') {
      if (inst.instituteUserId !== user.uuid) {
        throw new ForbiddenException('You cannot delete this institution.');
      }
    }

    // users → cannot delete
    if (userType === 'user') {
      throw new ForbiddenException('Users cannot delete institutions.');
    }

    return await this.institutionRepo.remove(inst);
  }
}

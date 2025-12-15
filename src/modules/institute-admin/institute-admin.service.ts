import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstituteAdmin } from './entities/institute-admin.entity';
import { CreateInstituteAdminDto } from './dto/create-institute-admin.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class InstituteAdminService {
  constructor(
    @InjectRepository(InstituteAdmin)
    private readonly repo: Repository<InstituteAdmin>,
    private readonly usersService: UsersService,
  ) {}

  // --------------------------------------------------
  // BASIC METHODS
  // --------------------------------------------------

  async create(dto: CreateInstituteAdminDto) {
    const instAdmin = await this.repo.save({
      instituteId: dto.instituteId,
      fullName: dto.fullName,
      phoneNumber: dto.phoneNumber,
      email: dto.email,
    });

    await this.usersService.createUser({
      email: dto.email,
      password: dto.password,
      userType: 'institute_admin',
      mappedId: instAdmin.instituteAdminId,
    });

    return instAdmin;
  }

  async findAll() {
    return this.repo.find();
  }

  // --------------------------------------------------
  // EXTRA CUSTOMER-LIKE METHODS (CONVERTED)
  // --------------------------------------------------

  // 1. Dashboard
  async getDashboard(uuid: string) {
    // TODO: Replace with actual dashboard logic
    return {
      message: 'Dashboard data will come here',
      uuid,
    };
  }

  // 2. Institutions linked to institute-admin
  async getInstitutions(uuid: string) {
    // TODO: Query real institution list
    return {
      message: 'Institutions list',
      uuid,
    };
  }

  // 3. Groups
  async getGroups(uuid: string) {
    // TODO: Query groups
    return {
      message: 'Groups list',
      uuid,
    };
  }

  // 4. Subgroups inside a group
  async getSubGroups(uuid: string, groupId: string) {
    // TODO: Query subgroups
    return {
      message: 'Subgroups list',
      uuid,
      groupId,
    };
  }

  // 5. Institutions inside a group
  async getInstitutionsByGroup(uuid: string, groupId: string) {
    // TODO: Query institutions under group
    return {
      message: 'Institutions inside group',
      uuid,
      groupId,
    };
  }

  // 6. Update institution status
  async updateInstitutionStatus(
    uuid: string,
    institutionId: string,
    isActive: boolean,
  ) {
    // TODO: Update actual institution status here
    return {
      message: 'Institution status updated',
      uuid,
      institutionId,
      isActive,
    };
  }

  // 7. Get Group Mappings (institutions + subgroups)
  async getGroupMappings(uuid: string, groupId: string) {
    // TODO: Query actual mappings
    return {
      message: 'Group mappings data',
      uuid,
      groupId,
    };
  }
}

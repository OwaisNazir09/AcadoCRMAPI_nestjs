import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstitutionGroup } from './entities/institution-group.entity';
import { InstitutionSubGroup } from './entities/institution-subgroup.entity';
import { InstituteGroupMapping } from './entities/institute-group-mapping.entity';

@Injectable()
export class InstituteGroupService {
  constructor(
    @InjectRepository(InstitutionGroup)
    private groupRepo: Repository<InstitutionGroup>,

    @InjectRepository(InstitutionSubGroup)
    private subRepo: Repository<InstitutionSubGroup>,

    @InjectRepository(InstituteGroupMapping)
    private mappingRepo: Repository<InstituteGroupMapping>,
  ) {}

  // GET ALL GROUPS
  async getAllGroups(user: any) {
    // user.userType contains 'admin'|'partner'|'institute_admin'|'user'
    if ((user.userType || '').toLowerCase() === 'admin') {
      return this.groupRepo.find({
        relations: ['subGroups', 'mappings'],
      });
    }

    // non-admins get groups belonging to their user id
    return this.groupRepo.find({
      where: { userId: user.uuid },
      relations: ['subGroups', 'mappings'],
    });
  }

  // GET GROUP BY ID
  async getGroupById(id: string, user: any) {
    const group = await this.groupRepo.findOne({
      where: { id },
      relations: ['subGroups', 'mappings'],
    });

    if (!group) throw new NotFoundException('Group not found');

    // admin can view any group, others only their own
    if ((user.userType || '').toLowerCase() !== 'admin' && group.userId !== user.uuid) {
      throw new ForbiddenException('Not allowed');
    }

    return group;
  }

  // CREATE GROUP
  async createGroup(dto: any, user: any) {
    // Decide which userId to assign to the group
    let userIdToAssign: string | null = null;

    // Admins and partners can optionally pass a userId owner (dto.userId)
    const userType = (user.userType || '').toLowerCase();
    if (userType === 'admin' || userType === 'partner') {
      // prefer dto.userId (frontend should send this) otherwise fallback to current user
      userIdToAssign = dto.userId ?? user.uuid;
    } else {
      // normal users and institute_admins get their own id
      Logger.log('Assigning userId to', user.uuid);
      userIdToAssign = user.uuid;
    }

    const group = this.groupRepo.create({
      groupName: dto.groupName,
      groupDescription: dto.groupDescription,
      createdById: user.uuid,
      userId: userIdToAssign,
    });

    return this.groupRepo.save(group);
  }

  // GET GROUPS BY USER (createdById)
  async getGroupsByUser(userId: string) {
    return this.groupRepo.find({
      where: { createdById: userId },
      relations: {
        subGroups: true,
        mappings: true,
      },
      order: {
        groupName: 'ASC',
        subGroups: {
          subGroupName: 'ASC',
        },
      },
    });
  }

  // UPDATE GROUP
  async updateGroup(id: string, dto: any, user: any) {
    const group = await this.getGroupById(id, user);

    if (dto.groupName) group.groupName = dto.groupName;
    if (dto.groupDescription) group.groupDescription = dto.groupDescription;

    return this.groupRepo.save(group);
  }

  // DELETE GROUP
  async deleteGroup(id: string, user: any) {
    const group = await this.getGroupById(id, user);
    await this.groupRepo.remove(group);

    return { message: 'Group deleted successfully' };
  }

  // CREATE SUBGROUP
  async createSubGroup(dto: any, user: any) {
    // Ensure parent group exists and caller has access
    const group = await this.getGroupById(dto.groupId, user);

    const sub = this.subRepo.create({
      subGroupName: dto.subGroupName,
      group,
    });

    return this.subRepo.save(sub);
  }

  // DELETE SUBGROUP
  async deleteSubGroup(id: string, user: any) {
    const sub = await this.subRepo.findOne({
      where: { id },
      relations: ['group'],
    });

    if (!sub) throw new NotFoundException('Subgroup not found');

    // Only admin or the owner of the group can delete
    if ((user.userType || '').toLowerCase() !== 'admin' && sub.group.userId !== user.uuid) {
      throw new ForbiddenException('Not allowed');
    }

    await this.subRepo.remove(sub);

    return { message: 'Subgroup deleted' };
  }

  // MAP INSTITUTE TO GROUP
  async addInstitute(dto: any, user: any) {
    // ensure group exists and user has access
    const group = await this.getGroupById(dto.groupId, user);

    const map = this.mappingRepo.create({
      group,
      instituteId: dto.instituteId,
      createdById: user.uuid,
    });

    return this.mappingRepo.save(map);
  }
}

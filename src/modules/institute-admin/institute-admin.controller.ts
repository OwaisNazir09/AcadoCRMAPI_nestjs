import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { InstituteAdminService } from './institute-admin.service';
import { CreateInstituteAdminDto } from './dto/create-institute-admin.dto';

@Controller('institute-admin')
export class InstituteAdminController {
  constructor(private readonly service: InstituteAdminService) {}

  // -----------------------
  // Basic Endpoints
  // -----------------------

  @Post('create')
  create(@Body() dto: CreateInstituteAdminDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ------------------------------------
  // Equivalent of CustomersController Endpoints
  // ------------------------------------

  // 1. Dashboard
  @Get(':uuid/dashboard')
  getDashboard(@Param('uuid') uuid: string) {
    return this.service.getDashboard(uuid);
  }

  // 2. Institutions List
  @Get(':uuid/institutions')
  getInstitutions(@Param('uuid') uuid: string) {
    return this.service.getInstitutions(uuid);
  }

  // 3. Groups
  @Get(':uuid/groups')
  getGroups(@Param('uuid') uuid: string) {
    return this.service.getGroups(uuid);
  }

  // 4. Subgroups inside group
  @Get(':uuid/groups/:groupId/subgroups')
  getSubGroups(
    @Param('uuid') uuid: string,
    @Param('groupId') groupId: string,
  ) {
    return this.service.getSubGroups(uuid, groupId);
  }

  // 5. Institutions inside group
  @Get(':uuid/groups/:groupId/institutions')
  getInstitutionsByGroup(
    @Param('uuid') uuid: string,
    @Param('groupId') groupId: string,
  ) {
    return this.service.getInstitutionsByGroup(uuid, groupId);
  }

  // 6. Update Institution Status
  @Patch(':uuid/institutions/:institutionId/status')
  updateInstitutionStatus(
    @Param('uuid') uuid: string,
    @Param('institutionId') institutionId: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.service.updateInstitutionStatus(uuid, institutionId, isActive);
  }

  // 7. Get Group Mappings
  @Get(':uuid/groups/:groupId/mappings')
  getGroupMappings(
    @Param('uuid') uuid: string,
    @Param('groupId') groupId: string,
  ) {
    return this.service.getGroupMappings(uuid, groupId);
  }
}

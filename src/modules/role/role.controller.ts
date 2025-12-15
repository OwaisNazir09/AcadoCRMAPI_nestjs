import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/constants/decorators/roles.decorator';
import { AssignRoutesDto } from './dto/assign-routes.dto';


@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Roles('admin')  
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createRole(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }

  @Post('assign-routes')
  @Roles('admin')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  assignRoutes(@Body() dto: AssignRoutesDto) {
    return this.roleService.assignRoutesToRole(dto);
  }

  @Get()
  @Roles('admin')  
  findAllRoles() {
    return this.roleService.findAllRoles();
  }


  @Delete(':id')
  @Roles('admin')  
  deleteRole(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }

  @Get(':id')
  @Roles('admin')  
  findRoleById(@Param('id') id: string) {
    return this.roleService.findRoleById(id);
  }
}

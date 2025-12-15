import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Role } from './entities/role.entity';
import { RouteGroup } from '../route/entities/route-group.entity';

import { CreateRoleDto } from './dto/create-role.dto';

import { Route } from '../route/entities/route.entity';
import { AssignRoutesDto } from './dto/assign-routes.dto';


@Injectable()
export class RoleService {
    constructor(
      @InjectRepository(Role)
      private readonly roleRepository: Repository<Role>,

      @InjectRepository(RouteGroup)
      private readonly groupRepository: Repository<RouteGroup>,

      @InjectRepository(Route)
      private readonly routeRepository: Repository<Route>,
    ) {}


  async createRole(dto: CreateRoleDto) {
    const role = this.roleRepository.create({
      roleName: dto.roleName,
      isActive: true,
    });

    return await this.roleRepository.save(role);
  }

  async findAllRoles() {
    return await this.roleRepository.find({
      relations: ['routeGroups'],
      order: { createdAt: 'DESC' },
    });
  }

  async findRoleById(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['routeGroups'],
    });

    if (!role) throw new NotFoundException('Role not found');
    return role;
  }



  async deleteRole(id: string) {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return await this.roleRepository.remove(role);
  }
  
  async assignRoutesToRole(dto: AssignRoutesDto) {
    const role = await this.roleRepository.findOne({
      where: { id: dto.roleId },
      relations: ['routes', 'routeGroups'],
    });

    if (!role) throw new NotFoundException('Role not found');

    if (!dto.routeIds || dto.routeIds.length === 0) {
      throw new BadRequestException('routeIds must be a non-empty array');
    }

    const routes = await this.routeRepository.find({
      where: { id: In(dto.routeIds) },
      relations: ['group'],
    });

    if (routes.length !== dto.routeIds.length) {
      const foundIds = routes.map(r => r.id);
      const missing = dto.routeIds.filter(id => !foundIds.includes(id));
      throw new NotFoundException(`One or more routes do not exist: ${missing.join(', ')}`);
    }

    const existingRouteIds = (role.routes || []).map(r => r.id);
    const mergedRoutes = [
      ...role.routes || [],
      ...routes.filter(r => !existingRouteIds.includes(r.id)),
    ];
    role.routes = mergedRoutes;

    const groupsFromRoutes = routes
      .map(r => r.group)
      .filter(g => g) 
      .reduce((acc, g) => {
        if (!acc.find(x => x.id === g.id)) acc.push(g);
        return acc;
      }, [] as any[]);

    const existingGroups = role.routeGroups || [];
    const mergedGroups = [
      ...existingGroups,
      ...groupsFromRoutes.filter(g => !existingGroups.find(eg => eg.id === g.id)),
    ];
    role.routeGroups = mergedGroups;

    const saved = await this.roleRepository.save(role);

    return await this.roleRepository.findOne({
      where: { id: saved.id },
      relations: ['routes', 'routeGroups'],
    });
  }
}
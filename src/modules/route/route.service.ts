import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Route } from './entities/route.entity';
import { RouteGroup } from './entities/route-group.entity';

import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { Role } from '../role/entities/role.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RouteService {
 constructor(
  @InjectRepository(Route)
  private readonly routeRepository: Repository<Route>,

  @InjectRepository(RouteGroup)
  private readonly groupRepository: Repository<RouteGroup>,

  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>,

  @InjectRepository(User)
  private readonly userRepository: Repository<User>,
) {}

  async createGroup(dto: CreateGroupDto) {
    const group = this.groupRepository.create({
      name: dto.name,
      icon: dto.icon,
    });

    return this.groupRepository.save(group);
  }

  async findAllGroups() {
    return this.groupRepository.find({
      relations: ['children'],
      order: { name: 'ASC' },
    });
  }

  async findGroupById(id: string) {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['children'],
    });

    if (!group) throw new NotFoundException('Route group not found');
    return group;
  }

  async deleteGroup(id: string) {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['children'],
    });

    if (!group) throw new NotFoundException('Route group not found');

    if (group.children && group.children.length > 0) {
      throw new NotFoundException(
        'Cannot delete group with existing routes. Remove all child routes first.'
      );
    }

    return this.groupRepository.remove(group);
  }

  async createRoute(dto: CreateRouteDto) {
    const group = await this.groupRepository.findOne({
      where: { id: dto.groupId },
    });

    if (!group) throw new NotFoundException('Route group not found');

    const route = this.routeRepository.create({
      name: dto.name,
      path: dto.path,
      group,
    });

    return this.routeRepository.save(route);
  }

  async updateRoute(id: string, dto: UpdateRouteDto) {
    const route = await this.routeRepository.findOne({ where: { id } });

    if (!route) throw new NotFoundException('Route not found');

    Object.assign(route, dto);
    return this.routeRepository.save(route);
  }

  async deleteRoute(id: string) {
    const route = await this.routeRepository.findOne({ where: { id } });
    if (!route) throw new NotFoundException('Route not found');

    return this.routeRepository.remove(route);
  }

  async findAllRoutes() {
    return this.routeRepository.find({
      relations: ['group'],
      order: { name: 'ASC' },
    });
  }

  async findRouteById(id: string) {
    const route = await this.routeRepository.findOne({
      where: { id },
      relations: ['group'],
    });

    if (!route) throw new NotFoundException('Route not found');
    return route;
  }

async getMenuByRole(user: any) {
  const systemUser = await this.userRepository.findOne({
    where: { userUuid: user.mappedId },
  });

  if (!systemUser) return [];

  const role = await this.roleRepository.findOne({
    where: { id: systemUser.roleId },
    relations: ['routeGroups', 'routes', 'routes.group'],
  });

  if (!role) return [];

  return role.routeGroups.map((group) => {
    const children = role.routes
      .filter((route) => route.group?.id === group.id)
      .map((route) => ({
        id: route.id,
        name: route.name,
        path: route.path,
      }));

    return {
      id: group.id,
      name: group.name,
      icon: group.icon,
      children,
    };
  });
}




}

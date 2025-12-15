import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from './entities/role.entity';
import { RouteGroup } from '../route/entities/route-group.entity';

import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Route } from '../route/entities/route.entity';

@Module({
imports: [TypeOrmModule.forFeature([Role, RouteGroup, Route])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RouteService } from './route.service';
import { RouteController } from './route.controller';

import { Route } from './entities/route.entity';
import { RouteGroup } from './entities/route-group.entity';
import { Role } from '../role/entities/role.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Route, RouteGroup, Role, User])
  ],
  controllers: [RouteController],
  providers: [RouteService],
  exports: [RouteService],
})
export class RouteModule {}

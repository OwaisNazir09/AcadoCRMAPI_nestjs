import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';

import { Package } from './entities/packages.entity';
import { PackageModule } from './entities/package-module.entity';
import { PackageModuleAction } from './entities/package-action.entity';
import { PackageAddon } from './entities/package-addon.entity';
import { Addon } from './entities/addon.entity';

import { Modules } from '../modules-and-action/entities/module.entity';
import { Action } from '../modules-and-action/entities/action.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Package,
      PackageModule,
      PackageModuleAction,
      PackageAddon,
      Addon,
      Modules,
      Action,
    ]),
  ],
  controllers: [PackagesController],
  providers: [PackagesService],
  exports: [PackagesService],
})
export class PackagesModule {}

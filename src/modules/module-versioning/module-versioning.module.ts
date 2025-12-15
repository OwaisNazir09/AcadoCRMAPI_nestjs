import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ModuleVersion } from './entities/module-version.entity';
import { ModuleChange } from './entities/module-change.entity';
import { ActionChange } from './entities/action-change.entity';

import { ModuleVersioningController } from './module-versioning.controller';
import { ModuleVersioningService } from './module-versioning.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModuleVersion,
      ModuleChange,
      ActionChange,
    ]),
  ],
  controllers: [ModuleVersioningController],
  providers: [ModuleVersioningService],
})
export class ModuleVersioningModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InstitutionGroup } from './entities/institution-group.entity';
import { InstitutionSubGroup } from './entities/institution-subgroup.entity';
import { InstituteGroupMapping } from './entities/institute-group-mapping.entity';

import { InstituteGroupService } from './institute-group.service';
import { InstituteGroupController } from './institute-group.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InstitutionGroup,
      InstitutionSubGroup,
      InstituteGroupMapping,
    ]),
  ],
  controllers: [InstituteGroupController],
  providers: [InstituteGroupService],
  exports: [InstituteGroupService],
})
export class InstituteGroupModule {}

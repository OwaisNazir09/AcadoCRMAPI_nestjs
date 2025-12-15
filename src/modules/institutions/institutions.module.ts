import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InstitutionsService } from './institutions.service';
import { InstitutionsController } from './institutions.controller';

import { Institute } from './entities/institution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Institute])],
  controllers: [InstitutionsController],
  providers: [InstitutionsService],
  exports: [InstitutionsService],
})
export class InstitutionsModule {}

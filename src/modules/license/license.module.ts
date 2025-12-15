import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { License } from './entities/license.entity';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';
import { Package } from '../packages/entities/packages.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([License, Package]),
  ],
  controllers: [LicenseController],
  providers: [LicenseService],
  exports: [LicenseService],
})
export class LicenseModule {}
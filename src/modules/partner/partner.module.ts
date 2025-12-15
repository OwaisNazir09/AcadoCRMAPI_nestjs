import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { Partner } from './entities/partner.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Partner]),
    UsersModule, 
  ],
  controllers: [PartnerController],
  providers: [PartnerService],
  exports: [PartnerService],
})
export class PartnerModule {}

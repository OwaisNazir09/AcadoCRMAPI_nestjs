import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InstituteAdminController } from './institute-admin.controller';
import { InstituteAdminService } from './institute-admin.service';
import { InstituteAdmin } from './entities/institute-admin.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InstituteAdmin]),
    UsersModule,  
  ],
  controllers: [InstituteAdminController],
  providers: [InstituteAdminService],
  exports: [InstituteAdminService], 
})
export class InstituteAdminModule {}

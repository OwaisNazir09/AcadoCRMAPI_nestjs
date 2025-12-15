import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemUsersController } from './system-users.controller';
import { SystemUsersService } from './system-users.service';
import { SystemUser } from './entities/system-user.entity';
import { UsersModule } from '../users/users.module';  

@Module({
  imports: [
    TypeOrmModule.forFeature([SystemUser]),
    UsersModule,  
  ],
  controllers: [SystemUsersController],
  providers: [SystemUsersService],
  exports: [SystemUsersService],
})
export class SystemUsersModule {}

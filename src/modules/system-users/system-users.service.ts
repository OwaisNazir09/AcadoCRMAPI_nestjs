import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SystemUser } from './entities/system-user.entity';
import { CreateSystemUserDto } from './dto/create-system-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class SystemUsersService {
  constructor(
    @InjectRepository(SystemUser)
    private readonly systemUserRepo: Repository<SystemUser>,

    private readonly usersService: UsersService,
  ) {}

 async create(dto: CreateSystemUserDto) {

  const profile = await this.systemUserRepo.save({
    fullName: dto.fullName,
    phoneNumber: dto.phoneNumber,
    roleId: dto.roleId,
  });

  await this.usersService.createUser({
    email: dto.email,
    password: dto.password,
    userType: dto.userType,   
    mappedId: profile.systemUserId,
  });

  return profile;
}


  async findAll() {
    return this.systemUserRepo.find();
  }
}

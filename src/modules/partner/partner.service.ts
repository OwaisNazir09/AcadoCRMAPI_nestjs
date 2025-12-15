import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from './entities/partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepo: Repository<Partner>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreatePartnerDto) {
    const partner = await this.partnerRepo.save({
      companyName: dto.companyName,
      contactPerson: dto.contactPerson,
      phoneNumber: dto.phoneNumber,
      email: dto.email,
    });

    await this.usersService.createUser({
      email: dto.email,
      password: dto.password,
      userType: 'partner',
      mappedId: partner.partnerId,
    });

    return partner;
  }

  async findAll() {
    return this.partnerRepo.find();
  }
}

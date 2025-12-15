import { Controller, Post, Body, Get } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';

@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post('create')
  create(@Body() dto: CreatePartnerDto) {
    return this.partnerService.create(dto);
  }

  @Get()
  findAll() {
    return this.partnerService.findAll();
  }
}

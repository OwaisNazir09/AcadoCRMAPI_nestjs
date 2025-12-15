import { Controller, Post, Body, Get } from '@nestjs/common';
import { SystemUsersService } from './system-users.service';
import { CreateSystemUserDto } from './dto/create-system-user.dto';

@Controller('system-users')
export class SystemUsersController {
  constructor(private readonly systemUsersService: SystemUsersService) {}

  @Post('create')
  create(@Body() dto: CreateSystemUserDto) {
    return this.systemUsersService.create(dto);
  }

  @Get()
  findAll() {
    return this.systemUsersService.findAll();
  }
}

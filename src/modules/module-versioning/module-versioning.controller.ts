import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ModuleVersioningService } from './module-versioning.service';
import { CreateVersionDto } from './dto/create-version.dto';
import { ModuleVersion } from './entities/module-version.entity';

@Controller('module-versions')
export class ModuleVersioningController {
  constructor(private readonly service: ModuleVersioningService) {}

  @Post()
  create(@Body() dto: CreateVersionDto): Promise<ModuleVersion> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<ModuleVersion[]> {
    return this.service.findAll();
  }

  @Get('version/:version')
  findByVersion(@Param('version') version: string): Promise<ModuleVersion> {
    return this.service.findByVersion(version);
  }
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ModuleVersion> {
    return this.service.findOne(id);
  }
  
}

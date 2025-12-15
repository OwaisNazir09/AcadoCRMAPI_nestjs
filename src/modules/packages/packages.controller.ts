import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Req,
  UseGuards
} from '@nestjs/common';

import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { CreateAddonDto } from './dto/create-addon.dto';
import { AssignLicenseDto } from './dto/assign-license.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/constants/decorators/roles.decorator';

@Controller('packages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PackagesController {
  constructor(private readonly service: PackagesService) {}

  /* ----------------- PACKAGES ----------------- */

  @Post()
  @Roles('admin')
  create(@Req() req, @Body() dto: CreatePackageDto) {
    return this.service.createPackage(dto, req.user.uuid);
  }

  @Get()
  findAll() {
    return this.service.getAllPackages();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.getPackageById(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: UpdatePackageDto,
  ) {
    return this.service.updatePackage(id, dto, req.user.uuid);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.service.deletePackage(id);
  }

  /* ----------------- ADDONS ----------------- */

  @Post('addons')
  @Roles('admin')
  createAddon(@Body() dto: CreateAddonDto) {
    return this.service.createAddon(dto);
  }

  @Get('addons/list')
  getAddons() {
    return this.service.getAllAddons();
  }

}

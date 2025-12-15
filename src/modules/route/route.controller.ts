import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';

import { RouteService } from './route.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { CreateGroupDto } from './dto/create-group.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/constants/decorators/roles.decorator';

@Controller('routes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

 @Get('routes')
getMenuByRole(@Req() req: any) {
  return this.routeService.getMenuByRole(req.user.mappedId);
}

  @Post()
  @Roles('admin') 
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createRoute(@Body() dto: CreateRouteDto) {
    return this.routeService.createRoute(dto);
  }

  @Patch(':id')
  @Roles('admin') 
  updateRoute(@Param('id') id: string, @Body() dto: UpdateRouteDto) {
    return this.routeService.updateRoute(id, dto);
  }

  @Delete(':id')
  @Roles('admin') 
  deleteRoute(@Param('id') id: string) {
    return this.routeService.deleteRoute(id);
  }

  @Get()
  findAllRoutes() {
    return this.routeService.findAllRoutes();
  }

  @Get(':id')
  findRouteById(@Param('id') id: string) {
    return this.routeService.findRouteById(id);
  }

  @Post('groups')
  @Roles('admin')
  createGroup(@Body() dto: CreateGroupDto) {
    return this.routeService.createGroup(dto);
  }

  @Get('groups/all')
  @Roles('admin')
  findAllGroups() {
    return this.routeService.findAllGroups();
  }

  @Get('groups/:id')
  @Roles('admin') 
  findGroupById(@Param('id') id: string) {
    return this.routeService.findGroupById(id);
  }

  @Delete('groups/:id')
  @Roles('admin') 
  deleteGroup(@Param('id') id: string) {
    return this.routeService.deleteGroup(id);
  }
}

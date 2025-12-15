import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ModulesAndActionService } from './modules-and-action.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateActionDto } from './dto/create-action.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/constants/decorators/roles.decorator';

@Controller('modules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ModulesAndActionController {
  constructor(private readonly service: ModulesAndActionService) {}

  @Post()
  @Roles('admin')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createModule(@Body() dto: CreateModuleDto, @Req() req: any) {
    return this.service.createModule(dto, req.user.uuid);
  }


  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':moduleId')
  findOne(@Param('moduleId') moduleId: string) {
    return this.service.findOne(moduleId);
  }

  @Patch(':moduleId')
  @Roles('admin')
  updateModule(
    @Param('moduleId') moduleId: string,
    @Body() dto: Partial<CreateModuleDto>,
    @Req() req: any,
  ) {
    return this.service.updateModule(moduleId, dto, req.user.uuid);
  }

  @Delete(':moduleId')
  @Roles('admin')
  deleteModule(@Param('moduleId') moduleId: string) {
    return this.service.deleteModule(moduleId);
  }

  /* --------------------- ACTIONS ----------------------- */

  @Post(':moduleId/actions')
  @Roles('admin')
  addAction(
    @Param('moduleId') moduleId: string,
    @Body() dto: CreateActionDto,
    @Req() req: any,
  ) {
    return this.service.addAction(moduleId, dto, req.user.uuid);
  }

  @Get(':moduleId/actions')
  getActions(@Param('moduleId') moduleId: string) {
    return this.service.getActions(moduleId);
  }

  @Get(':moduleId/actions/:actionId')
  getActionById(
    @Param('moduleId') moduleId: string,
    @Param('actionId') actionId: string,
  ) {
    return this.service.getActionById(moduleId, actionId);
  }

  @Patch(':moduleId/actions/:actionId')
  updateAction(
    @Param('moduleId') moduleId: string,
    @Param('actionId') actionId: string,
    @Body() dto: Partial<CreateActionDto>,
    @Req() req: any,
  ) {
    return this.service.updateAction(moduleId, actionId, dto, req.user.uuid);
  }

  @Delete(':moduleId/actions/:actionId')
  deleteAction(
    @Param('moduleId') moduleId: string,
    @Param('actionId') actionId: string,
  ) {
    return this.service.deleteAction(moduleId, actionId);
  }
}

import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { InstituteGroupService } from './institute-group.service';
import { CreateSubGroupDto } from './dto/create-subgroup.dto';
import { AddInstituteDto } from './dto/add-institute.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('institute-groups')
@UseGuards(JwtAuthGuard)
export class InstituteGroupController {
  constructor(private readonly service: InstituteGroupService) {}

  @Get()
  getAll(@Req() req) {
    return this.service.getAllGroups(req.user);
  }
  @Get('by-user/:userId')
getGroupsByUser(@Param('userId') userId: string) {
  return this.service.getGroupsByUser(userId);
}

  @Get(':id')
  getById(@Param('id') id: string, @Req() req) {
    return this.service.getGroupById(id, req.user);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createGroup(@Body() body: any, @Req() req: any) {
    return this.service.createGroup(body, req.user);
  }

  @Patch(':id')
  updateGroup(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.service.updateGroup(id, body, req.user);
  }

  @Delete(':id')
  deleteGroup(@Param('id') id: string, @Req() req: any) {
    return this.service.deleteGroup(id, req.user);
  }

  @Post('sub-group')
  createSubGroup(@Body() dto: CreateSubGroupDto, @Req() req: any) {
    return this.service.createSubGroup(dto, req.user);
  }

  @Delete('sub-group/:id')
  deleteSubGroup(@Param('id') id: string, @Req() req: any) {
    return this.service.deleteSubGroup(id, req.user);
  }

  @Post('add-institute')
  addInstitute(@Body() dto: AddInstituteDto, @Req() req: any) {
    return this.service.addInstitute(dto, req.user);
  }
}

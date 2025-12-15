import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  Req,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { InstitutionsService } from './institutions.service';

import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Controller('institutions')
@UseGuards(JwtAuthGuard)
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}


  // CREATE

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateInstitutionDto, @Req() req: any) {
    return this.institutionsService.create(dto, req.user);
  }


  // FETCH ALL 

  @Get()
  findAll(@Req() req: any) {
    return this.institutionsService.findAll(req.user);
  }


  // FETCH ONE BY UUID

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.institutionsService.findOne(id);
  }


  // UPDATE

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateInstitutionDto,
    @Req() req: any,
  ) {
    return this.institutionsService.update(id, dto, req.user);
  }


  // DELETE

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.institutionsService.remove(id, req.user);
  }
}

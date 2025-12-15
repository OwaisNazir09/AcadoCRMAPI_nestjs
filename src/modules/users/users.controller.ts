import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/constants/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @Roles('admin')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get()
  @Roles('admin')
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.usersService.findAll(page, limit);
  }

  @Get(':uuid')
  @Roles('admin')
  findOne(@Param('uuid') uuid: string) {
    return this.usersService.findOne(uuid);
  }

  @Patch(':uuid')
  @Roles('admin')
  update(@Param('uuid') uuid: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(uuid, dto);
  }

  @Delete(':uuid')
  @Roles('admin')
  remove(@Param('uuid') uuid: string) {
    return this.usersService.deleteUser(uuid);
  }

  @Patch('deactivate/:uuid')
  @Roles('admin')
  deactivate(@Param('uuid') uuid: string) {
    return this.usersService.deactivateUser(uuid);
  }

  @Patch('activate/:uuid')
  @Roles('admin')
  activate(@Param('uuid') uuid: string) {
    return this.usersService.activateUser(uuid);
  }
}

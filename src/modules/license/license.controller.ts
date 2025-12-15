import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  Req,
  UseGuards 
} from '@nestjs/common';
import { LicenseService } from './license.service';
import { CreateLicenseDto } from './dto/create-license.dto';
import { AssignLicenseDto } from './dto/assign-license.dto';
import { RenewLicenseDto } from './dto/renew-license.dto';
import { RevokeLicenseDto } from './dto/revoke-license.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/constants/decorators/roles.decorator';

@Controller('licenses')
@UseGuards(JwtAuthGuard)
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  /* ----------------- CREATE ----------------- */

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'super-admin')
  createLicense(@Body() dto: CreateLicenseDto, @Req() req) {
    return this.licenseService.createLicense(dto, req.user.id);
  }

  /* ----------------- READ ----------------- */

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin', 'super-admin')
  getAllLicenses(
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('institutionId') institutionId?: string,
    @Query('isTrial') isTrial?: string,
  ) {
    // Convert string to boolean
    const isTrialBool = isTrial ? isTrial === 'true' : undefined;
    
    return this.licenseService.getAllLicenses({
      status,
      customerId,
      institutionId,
      isTrial: isTrialBool,
    });
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super-admin', 'institution-admin')
  getLicenseById(@Param('id') id: string) {
    return this.licenseService.getLicenseById(id);
  }

  @Get('key/:licenseKey')
  getLicenseByKey(@Param('licenseKey') licenseKey: string) {
    return this.licenseService.getLicenseByKey(licenseKey);
  }

  @Get('customer/:customerId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super-admin', 'customer')
  getLicensesByCustomer(@Param('customerId') customerId: string) {
    return this.licenseService.getLicensesByCustomer(customerId);
  }

  @Get('institution/:institutionId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super-admin', 'institution-admin')
  getLicenseByInstitution(@Param('institutionId') institutionId: string) {
    return this.licenseService.getLicenseByInstitution(institutionId);
  }

  /* ----------------- UPDATE ----------------- */

  @Put(':id/assign')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super-admin')
  assignLicense(@Param('id') id: string, @Body() dto: AssignLicenseDto) {
    return this.licenseService.assignLicense(id, dto);
  }

  @Put(':id/renew')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super-admin')
  renewLicense(@Param('id') id: string, @Body() dto: RenewLicenseDto) {
    return this.licenseService.renewLicense(id, dto);
  }

  @Put(':id/revoke')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super-admin')
  revokeLicense(@Param('id') id: string, @Body() dto: RevokeLicenseDto) {
    return this.licenseService.revokeLicense(id, dto);
  }

  @Put(':id/suspend')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super-admin')
  suspendLicense(@Param('id') id: string, @Body('reason') reason: string) {
    return this.licenseService.suspendLicense(id, reason);
  }

  @Put(':id/activate')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super-admin')
  activateLicense(@Param('id') id: string) {
    return this.licenseService.activateLicense(id);
  }

  /* ----------------- UTILITIES ----------------- */

  @Get('expiring/soon')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super-admin')
  getExpiringLicenses(@Query('days') days: string) {
    const daysThreshold = days ? parseInt(days) : 7;
    return this.licenseService.getExpiringLicenses(daysThreshold);
  }

  @Post('check-expired')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super-admin')
  checkExpiredLicenses() {
    return this.licenseService.checkExpiredLicenses();
  }

  /* ----------------- USER MANAGEMENT ----------------- */

  @Put(':id/add-user')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super-admin', 'institution-admin')
  addUserToLicense(@Param('id') id: string) {
    return this.licenseService.addUserToLicense(id);
  }

  @Put(':id/remove-user')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super-admin', 'institution-admin')
  removeUserFromLicense(@Param('id') id: string) {
    return this.licenseService.removeUserFromLicense(id);
  }
}
import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Package } from './entities/packages.entity';
import { PackageModule } from './entities/package-module.entity';
import { PackageModuleAction } from './entities/package-action.entity';
import { PackageAddon } from './entities/package-addon.entity';
import { Addon } from './entities/addon.entity';

import { Modules } from '../modules-and-action/entities/module.entity';
import { Action } from '../modules-and-action/entities/action.entity';

import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { AssignLicenseDto } from './dto/assign-license.dto';
import { CreateAddonDto } from './dto/create-addon.dto';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepo: Repository<Package>,

    @InjectRepository(PackageModule)
    private readonly packageModuleRepo: Repository<PackageModule>,

    @InjectRepository(PackageModuleAction)
    private readonly packageActionRepo: Repository<PackageModuleAction>,

    @InjectRepository(Addon)
    private readonly addonRepo: Repository<Addon>,

    @InjectRepository(PackageAddon)
    private readonly packageAddonRepo: Repository<PackageAddon>,


    @InjectRepository(Modules)
    private readonly moduleRepo: Repository<Modules>,

    @InjectRepository(Action)
    private readonly actionRepo: Repository<Action>,
  ) {}

  /* -------------------------------------------
        CREATE PACKAGE
  -------------------------------------------- */

  async createPackage(dto: CreatePackageDto, adminId: string) {
    const pack = this.packageRepo.create({
      name: dto.name,
      description: dto.description,
      basePrice: dto.basePrice,
      totalPrice: dto.basePrice,
      createdBy: adminId,
    });

    const saved = await this.packageRepo.save(pack);

    /* ----- Add Modules ----- */

    for (const mod of dto.modules ?? []) {
      const moduleData = await this.moduleRepo.findOne({
        where: { id: mod.moduleId },
        relations: ['actions'],
      });

      if (!moduleData)
        throw new NotFoundException(`Module not found: ${mod.moduleId}`);

      const packageModule = await this.packageModuleRepo.save(
        this.packageModuleRepo.create({
          package: { id: saved.id } as any,
          module: { id: moduleData.id } as any,
          fullModule: mod.fullModule,
        })
      );

      if (!mod.fullModule) {
        for (const actionId of mod.actions) {
          const actionData = await this.actionRepo.findOne({
            where: { id: actionId },
          });

          if (!actionData)
            throw new NotFoundException(`Action not found: ${actionId}`);

          await this.packageActionRepo.save(
            this.packageActionRepo.create({
              packageModule,
              action: actionData,
            })
          );
        }
      }
    }

    /* ----- Add Addons ----- */
    let addonsTotal = 0;

    for (const addonId of dto.addons ?? []) {
      const addon = await this.addonRepo.findOne({ where: { id: addonId } });
      if (!addon) throw new NotFoundException(`Addon not found: ${addonId}`);

      await this.packageAddonRepo.save(
        this.packageAddonRepo.create({
          package: { id: saved.id } as any,
          addon,
        })
      );

      addonsTotal += addon.price;
    }

    saved.totalPrice = saved.basePrice + addonsTotal;

    return this.packageRepo.save(saved);
  }

  /* -------------------------------------------
        UPDATE PACKAGE
  -------------------------------------------- */

  async updatePackage(id: string, dto: UpdatePackageDto, adminId: string) {
    const pack = await this.packageRepo.findOne({
      where: { id },
      relations: ['modules', 'addons'],
    });

    if (!pack) throw new NotFoundException('Package not found');

    if (dto.name) pack.name = dto.name;
    if (dto.description) pack.description = dto.description;
    if (dto.basePrice) pack.basePrice = dto.basePrice;

    /* Reset old modules */
    await this.packageModuleRepo.delete({ package: pack });

    /* Add updated modules */
    let addonsTotal = 0;

    for (const mod of dto.modules ?? []) {
      const moduleData = await this.moduleRepo.findOne({
        where: { id: mod.moduleId },
        relations: ['actions'],
      });

      if (!moduleData) {
        throw new NotFoundException(`Module not found: ${mod.moduleId}`);
      }

      const packageModule = await this.packageModuleRepo.save(
        this.packageModuleRepo.create({
          package: { id: pack.id } as any,
          module: { id: moduleData.id } as any,
          fullModule: mod.fullModule,
        })
      );

      if (!mod.fullModule) {
        for (const actionId of mod.actions) {
          const actionData = await this.actionRepo.findOne({
            where: { id: actionId },
          });

          if (!actionData) {
            throw new NotFoundException(`Action not found: ${actionId}`);
          }

          await this.packageActionRepo.save(
            this.packageActionRepo.create({
              packageModule,
              action: actionData,
            })
          );
        }
      }
    }

    /* Reset addons */
    await this.packageAddonRepo.delete({ package: pack });

    for (const addonId of dto.addons ?? []) {
      const addon = await this.addonRepo.findOne({ where: { id: addonId } });

      if (!addon) {
        throw new NotFoundException(`Addon not found: ${addonId}`);
      }

      await this.packageAddonRepo.save(
        this.packageAddonRepo.create({
          package: pack,
          addon,
        })
      );

      addonsTotal += addon.price;
    }

    pack.totalPrice = pack.basePrice + addonsTotal;

    return this.packageRepo.save(pack);
  }

  /* -------------------------------------------
        GET PACKAGES
  -------------------------------------------- */

  getAllPackages() {
    return this.packageRepo.find({
      relations: [
        'modules',
        'modules.module',
        'modules.actions',
        'addons',
        'addons.addon',
      ],
    });
  }

  getPackageById(id: string) {
    return this.packageRepo.findOne({
      where: { id },
      relations: [
        'modules',
        'modules.module',
        'modules.actions',
        'addons',
        'addons.addon',
      ],
    });
  }

  /* -------------------------------------------
        DELETE PACKAGE
  -------------------------------------------- */

  async deletePackage(id: string) {
    const pack = await this.packageRepo.findOne({ where: { id } });
    if (!pack) throw new NotFoundException('Package not found');

    await this.packageRepo.remove(pack);
    return { success: true };
  }

  /* -------------------------------------------
        ADDONS
  -------------------------------------------- */

  createAddon(dto: CreateAddonDto) {
    return this.addonRepo.save(this.addonRepo.create(dto));
  }

  getAllAddons() {
    return this.addonRepo.find();
  }

}
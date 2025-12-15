import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ModuleVersion } from './entities/module-version.entity';
import { ModuleChange } from './entities/module-change.entity';
import { ActionChange } from './entities/action-change.entity';

import { CreateVersionDto } from './dto/create-version.dto';

@Injectable()
export class ModuleVersioningService {
  constructor(
    @InjectRepository(ModuleVersion)
    private versionRepo: Repository<ModuleVersion>,

    @InjectRepository(ModuleChange)
    private moduleRepo: Repository<ModuleChange>,

    @InjectRepository(ActionChange)
    private actionRepo: Repository<ActionChange>,
  ) {}

  // ---------------------------------------------------
  // CREATE VERSION (manual)
  // ---------------------------------------------------
  async create(dto: CreateVersionDto): Promise<ModuleVersion> {

    // Validate remarks for updated / added
    dto.modules.forEach((m) => {
      if (['updated', 'added'].includes(m.changeType) && !m.remarks) {
        throw new BadRequestException(
          `Remarks required for module ${m.code}`
        );
      }

      m.actions.forEach((a) => {
        if (['updated', 'added'].includes(a.changeType) && !a.remarks) {
          throw new BadRequestException(
            `Remarks required for action ${a.code}`
          );
        }
      });
    });

    const version = this.versionRepo.create({
      version: dto.version,
      releasedBy: dto.releasedBy,
      releasedAt: dto.releasedAt,
      remarks: dto.remarks,
      modules: dto.modules.map((m) => ({
        ...m,
        actions: m.actions.map((a) => ({ ...a })),
      })),
    });

    return this.versionRepo.save(version);
  }

  // ---------------------------------------------------
  // FIND ALL VERSIONS
  // ---------------------------------------------------
  async findAll(): Promise<ModuleVersion[]> {
    return this.versionRepo.find({
      relations: ['modules', 'modules.actions'],
      order: { releasedAt: 'DESC' },
    });
  }

  // ---------------------------------------------------
  // FIND VERSION BY ID
  // ---------------------------------------------------
  async findOne(id: string): Promise<ModuleVersion> {
    const version = await this.versionRepo.findOne({
      where: { id },
      relations: ['modules', 'modules.actions'],
    });

    if (!version) throw new NotFoundException('Version not found');

    return version;
  }
  

  // ---------------------------------------------------
  // FIND VERSION BY STRING (e.g., v1.3.0)
  // ---------------------------------------------------
  async findByVersion(version: string): Promise<ModuleVersion> {
    const found = await this.versionRepo.findOne({
      where: { version },
      relations: ['modules', 'modules.actions'],
    });

    if (!found)
      throw new NotFoundException(`Version '${version}' not found`);

    return found;
  }
  
}

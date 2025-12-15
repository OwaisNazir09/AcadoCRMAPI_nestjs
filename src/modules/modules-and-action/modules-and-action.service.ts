import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Modules } from './entities/module.entity';
import { Action } from './entities/action.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateActionDto } from './dto/create-action.dto';

@Injectable()
export class ModulesAndActionService {
  constructor(
    @InjectRepository(Modules)
    private readonly moduleRepo: Repository<Modules>,

    @InjectRepository(Action)
    private readonly actionRepo: Repository<Action>,
  ) {}

  /* ---------------- MODULES ---------------- */

  async createModule(dto: CreateModuleDto, userId: string) {
    const mod = this.moduleRepo.create({
      ...dto,
      createdBy: userId,
      isActive: dto.isActive ?? true,
    });

    return this.moduleRepo.save(mod);
  }

  async findAll() {
    return this.moduleRepo.find({ relations: ['actions'] });
  }

  async findOne(moduleId: string) {
    const mod = await this.moduleRepo.findOne({
      where: { id: moduleId },
      relations: ['actions'],
    });
    if (!mod) throw new NotFoundException('Module not found');
    return mod;
  }

  async updateModule(moduleId: string, dto: Partial<CreateModuleDto>, userId: string) {
    const mod = await this.moduleRepo.findOne({ where: { id: moduleId } });
    if (!mod) throw new NotFoundException('Module not found');

    Object.assign(mod, dto);
    mod.updatedBy = userId;
    return this.moduleRepo.save(mod);
  }

  async deleteModule(moduleId: string) {
    const mod = await this.moduleRepo.findOne({ where: { id: moduleId } });
    if (!mod) throw new NotFoundException('Module not found');

    await this.moduleRepo.remove(mod);
    return { success: true };
  }

  /* ---------------- ACTIONS ---------------- */

  async addAction(moduleId: string, dto: CreateActionDto, userId: string) {
    const mod = await this.moduleRepo.findOne({ where: { id: moduleId } });
    if (!mod) throw new NotFoundException('Module not found');

    const exists = await this.actionRepo.findOne({
      where: { code: dto.code, module: { id: moduleId } as any },
    });
    if (exists) throw new BadRequestException('Action with this code already exists for module');

    const action = this.actionRepo.create({
      ...dto,
      createdBy: userId,
      isActive: dto.isActive ?? true,
      module: { id: moduleId } as any,
    });

    return this.actionRepo.save(action);
  }

  async getActions(moduleId: string) {
    const mod = await this.moduleRepo.findOne({ where: { id: moduleId } });
    if (!mod) throw new NotFoundException('Module not found');

    return this.actionRepo.find({ where: { module: { id: moduleId } as any } });
  }

  async getActionById(moduleId: string, actionId: string) {
    const action = await this.actionRepo.findOne({
      where: { id: actionId },
      relations: ['module'],
    });
    if (!action) throw new NotFoundException('Action not found');
    if (!action.module || action.module.id !== moduleId)
      throw new BadRequestException('Action does not belong to the provided module');

    return action;
  }

  async updateAction(
    moduleId: string,
    actionId: string,
    dto: Partial<CreateActionDto>,
    userId: string,
  ) {
    const action = await this.actionRepo.findOne({
      where: { id: actionId },
      relations: ['module'],
    });
    if (!action) throw new NotFoundException('Action not found');
    if (!action.module || action.module.id !== moduleId)
      throw new BadRequestException('Action does not belong to the provided module');

    if ((dto as any).moduleId) delete (dto as any).moduleId;

    Object.assign(action, dto);
    action.updatedBy = userId;
    return this.actionRepo.save(action);
  }

  async deleteAction(moduleId: string, actionId: string) {
    const action = await this.actionRepo.findOne({
      where: { id: actionId },
      relations: ['module'],
    });
    if (!action) throw new NotFoundException('Action not found');
    if (!action.module || action.module.id !== moduleId)
      throw new BadRequestException('Action does not belong to the provided module');

    await this.actionRepo.remove(action);
    return { success: true };
  }
}

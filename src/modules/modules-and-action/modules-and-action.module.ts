import { Module } from '@nestjs/common';
import { ModulesAndActionService } from './modules-and-action.service';
import { ModulesAndActionController } from './modules-and-action.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Modules } from './entities/module.entity';
import { Action } from './entities/action.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Modules, Action]),
  ],
  controllers: [ModulesAndActionController],
  providers: [ModulesAndActionService],
  exports: [ModulesAndActionService],
})
export class ModulesAndActionModule {}

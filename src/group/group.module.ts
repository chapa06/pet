import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { Group } from './group.entity';
import { GroupRepository } from './group.repository'
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, GroupRepository]),
  ],
  controllers: [
    GroupController,
  ],
  providers: [
    GroupService, GroupRepository
  ],
  exports: [GroupService, GroupRepository] 
})
export class GroupModule {}
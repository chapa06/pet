import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Group } from './group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupRepository } from './group.repository';
import { DATA_SOURCE_TOKEN } from 'src/database/database.provider';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GroupService {
  constructor(
    @Inject('GroupRepository')
          private groupRepository: GroupRepository,
        ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const newGroup = this.groupRepository.create(createGroupDto);
    return this.groupRepository.save(newGroup);
  }

  async findAll(): Promise<Group[]> {
    return this.groupRepository.find();
  }

  async findOneById(id: string): Promise<Group> {
    const group = await this.groupRepository.findOneBy({ id });
    
    if (!group) {
      throw new NotFoundException(`Группа с ID "${id}" не найдена.`);
    }

    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    await this.findOneById(id); 
    await this.groupRepository.update(id, updateGroupDto); 
    return this.findOneById(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.groupRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Группа с ID "${id}" не найдена.`);
    }
  }
}
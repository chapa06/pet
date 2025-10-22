import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { Group } from './group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { NotFoundException } from '@nestjs/common';

describe('GroupController', () => {
  let controller: GroupController;
  let service: GroupService;

  const mockGroup: Group = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Group A',
    students: [],
    lessons: [],
  };

  const mockGroupService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [
        {
          provide: GroupService,
          useValue: mockGroupService,
        },
      ],
    }).compile();

    controller = module.get<GroupController>(GroupController);
    service = module.get<GroupService>(GroupService);
  });

  describe('create', () => {
    it('должен создать новую группу', async () => {
      const createDto: CreateGroupDto = {
        name: 'Group A',
      };

      mockGroupService.create.mockResolvedValue(mockGroup);

      const result = await controller.create(createDto);
      expect(result).toEqual(mockGroup);
      expect(mockGroupService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('должен вернуть массив групп', async () => {
      const groups = [mockGroup];
      mockGroupService.findAll.mockResolvedValue(groups);

      const result = await controller.findAll();
      expect(result).toEqual(groups);
      expect(mockGroupService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('должен вернуть группу по id', async () => {
      mockGroupService.findOneById.mockResolvedValue(mockGroup);

      const result = await controller.findOne(mockGroup.id);
      expect(result).toEqual(mockGroup);
      expect(mockGroupService.findOneById).toHaveBeenCalledWith(mockGroup.id);
    });

    it('должен выбросить NotFoundException, если группа не найдена', async () => {
      mockGroupService.findOneById.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('должен обновить группу', async () => {
      const updateDto: UpdateGroupDto = {
        name: 'Group B',
      };
      const updatedGroup = { ...mockGroup, ...updateDto };

      mockGroupService.update.mockResolvedValue(updatedGroup);

      const result = await controller.update(mockGroup.id, updateDto);
      expect(result).toEqual(updatedGroup);
      expect(mockGroupService.update).toHaveBeenCalledWith(mockGroup.id, updateDto);
    });

    it('должен выбросить NotFoundException, если группа не найдена', async () => {
      mockGroupService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update('non-existent-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('должен удалить группу', async () => {
      mockGroupService.remove.mockResolvedValue(undefined);

      await expect(controller.remove(mockGroup.id)).resolves.toBeUndefined();
      expect(mockGroupService.remove).toHaveBeenCalledWith(mockGroup.id);
    });

    it('должен выбросить NotFoundException, если группа не найдена', async () => {
      mockGroupService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
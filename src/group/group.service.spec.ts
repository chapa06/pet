import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from './group.service';
import { GroupRepository } from './group.repository';
import { Group } from './group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { NotFoundException } from '@nestjs/common';

describe('GroupService', () => {
  let service: GroupService;
  let repository: GroupRepository;

  const mockGroup: Group = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Group A',
    students: [],
    lessons: [],
  };

  const mockGroupRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: 'GroupRepository',
          useValue: mockGroupRepository,
        },
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
    repository = module.get<GroupRepository>('GroupRepository');
  });

  describe('create', () => {
    it('should create and save a new group', async () => {
      const createDto: CreateGroupDto = {
        name: 'Group A',
      };

      mockGroupRepository.create.mockReturnValue(mockGroup);
      mockGroupRepository.save.mockResolvedValue(mockGroup);

      const result = await service.create(createDto);
      expect(result).toEqual(mockGroup);
      expect(mockGroupRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockGroupRepository.save).toHaveBeenCalledWith(mockGroup);
    });
  });

  describe('findAll', () => {
    it('should return all groups', async () => {
      const groups = [mockGroup];
      mockGroupRepository.find.mockResolvedValue(groups);

      const result = await service.findAll();
      expect(result).toEqual(groups);
      expect(mockGroupRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('should return a group by id', async () => {
      mockGroupRepository.findOneBy.mockResolvedValue(mockGroup);

      const result = await service.findOneById(mockGroup.id);
      expect(result).toEqual(mockGroup);
      expect(mockGroupRepository.findOneBy).toHaveBeenCalledWith({ id: mockGroup.id });
    });

    it('should throw NotFoundException if group not found', async () => {
      mockGroupRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOneById('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a group', async () => {
      const updateDto: UpdateGroupDto = {
        name: 'Group B',
      };
      const updatedGroup = { ...mockGroup, ...updateDto };

      mockGroupRepository.findOneBy.mockResolvedValue(mockGroup);
      mockGroupRepository.update.mockResolvedValue({ affected: 1 });
      mockGroupRepository.findOneBy.mockResolvedValue(updatedGroup);

      const result = await service.update(mockGroup.id, updateDto);
      expect(result).toEqual(updatedGroup);
      expect(mockGroupRepository.update).toHaveBeenCalledWith(mockGroup.id, updateDto);
      expect(mockGroupRepository.findOneBy).toHaveBeenCalledWith({ id: mockGroup.id });
    });

    it('should throw NotFoundException if group not found', async () => {
      mockGroupRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update('non-existent-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a group', async () => {
      mockGroupRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(mockGroup.id)).resolves.toBeUndefined();
      expect(mockGroupRepository.delete).toHaveBeenCalledWith(mockGroup.id);
    });

    it('should throw NotFoundException if group not found', async () => {
      mockGroupRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
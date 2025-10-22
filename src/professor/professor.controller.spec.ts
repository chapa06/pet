import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorController } from './professor.controller';
import { ProfessorService } from './professor.service';
import { Professor } from './professor.entity';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProfessorController', () => {
  let controller: ProfessorController;
  let service: ProfessorService;

  const mockProfessor: Professor = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Александр',
    surname: 'Александров',
    patronymic: 'Александрович',
    dateOfBirth: new Date('1970-01-01'),
    lessons:[],
  };

  const mockProfessorService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessorController],
      providers: [
        {
          provide: ProfessorService,
          useValue: mockProfessorService,
        },
      ],
    }).compile();

    controller = module.get<ProfessorController>(ProfessorController);
    service = module.get<ProfessorService>(ProfessorService);
  });

  describe('create', () => {
    it('должен создать нового профессора', async () => {
      const createDto: CreateProfessorDto = {
        name: 'Александр',
        surname: 'Александров',
        patronymic: 'Александрович',
        dateOfBirth: '1970-01-01',
      };

      mockProfessorService.create.mockResolvedValue(mockProfessor);

      const result = await controller.create(createDto);
      expect(result).toEqual(mockProfessor);
      expect(mockProfessorService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('должен вернуть массив профессоров', async () => {
      const professors = [mockProfessor];
      mockProfessorService.findAll.mockResolvedValue(professors);

      const result = await controller.findAll();
      expect(result).toEqual(professors);
      expect(mockProfessorService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('должен вернуть профессора по id', async () => {
      mockProfessorService.findOneById.mockResolvedValue(mockProfessor);

      const result = await controller.findOne(mockProfessor.id);
      expect(result).toEqual(mockProfessor);
      expect(mockProfessorService.findOneById).toHaveBeenCalledWith(mockProfessor.id);
    });

    it('должен выбросить NotFoundException, если профессор не найден', async () => {
      mockProfessorService.findOneById.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('должен обновить профессора', async () => {
      const updateDto: UpdateProfessorDto = {
        name: 'John',
        surname: 'Doe',
        dateOfBirth: '1971-01-01',
      };
      const updatedProfessor = { ...mockProfessor, ...updateDto };

      mockProfessorService.update.mockResolvedValue(updatedProfessor);

      const result = await controller.update(mockProfessor.id, updateDto);
      expect(result).toEqual(updatedProfessor);
      expect(mockProfessorService.update).toHaveBeenCalledWith(mockProfessor.id, updateDto);
    });

    it('должен выбросить NotFoundException, если профессор не найден', async () => {
      mockProfessorService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update('non-existent-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('должен удалить профессора', async () => {
      mockProfessorService.remove.mockResolvedValue(undefined);

      await expect(controller.remove(mockProfessor.id)).resolves.toBeUndefined();
      expect(mockProfessorService.remove).toHaveBeenCalledWith(mockProfessor.id);
    });

    it('должен выбросить NotFoundException, если профессор не найден', async () => {
      mockProfessorService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
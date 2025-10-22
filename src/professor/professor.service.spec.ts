import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorService } from './professor.service';
import { ProfessorRepository } from './professor.repository';
import { Professor } from './professor.entity';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProfessorService', () => {
  let service: ProfessorService;
  let repository: ProfessorRepository;

  const mockProfessor: Professor = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Александр',
    surname: 'Александров',
    patronymic: 'Александрович',
    dateOfBirth: new Date('1970-01-01'),
    lessons:[],
  };

  const mockProfessorRepository = {
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
        ProfessorService,
        {
          provide: 'ProfessorRepository',
          useValue: mockProfessorRepository,
        },
      ],
    }).compile();

    service = module.get<ProfessorService>(ProfessorService);
    repository = module.get<ProfessorRepository>('ProfessorRepository');
  });

  describe('create', () => {
    it('should create and save a new professor', async () => {
      const createDto: CreateProfessorDto = {
        name: 'Александр',
        surname: 'Александров',
        patronymic: 'Александрович',
        dateOfBirth: '1970-01-01',
      };

      mockProfessorRepository.create.mockReturnValue(mockProfessor);
      mockProfessorRepository.save.mockResolvedValue(mockProfessor);

      const result = await service.create(createDto);
      expect(result).toEqual(mockProfessor);
      expect(mockProfessorRepository.create).toHaveBeenCalledWith({
        ...createDto,
        dateOfBirth: new Date(createDto.dateOfBirth),
      });
      expect(mockProfessorRepository.save).toHaveBeenCalledWith(mockProfessor);
    });
  });

  describe('findAll', () => {
    it('should return all professors', async () => {
      const professors = [mockProfessor];
      mockProfessorRepository.find.mockResolvedValue(professors);

      const result = await service.findAll();
      expect(result).toEqual(professors);
      expect(mockProfessorRepository.find).toHaveBeenCalledWith({});
    });
  });

  describe('findOneById', () => {
    it('should return a professor by id', async () => {
      mockProfessorRepository.findOneBy.mockResolvedValue(mockProfessor);

      const result = await service.findOneById(mockProfessor.id);
      expect(result).toEqual(mockProfessor);
      expect(mockProfessorRepository.findOneBy).toHaveBeenCalledWith({ id: mockProfessor.id });
    });

    it('should throw NotFoundException if professor not found', async () => {
      mockProfessorRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOneById('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a professor', async () => {
      const updateDto: UpdateProfessorDto = {
        name: 'John',
        surname: 'Doe',
        dateOfBirth: '1971-01-01',
      };
      const updatedProfessor = { ...mockProfessor, ...updateDto };

      mockProfessorRepository.findOneBy.mockResolvedValue(mockProfessor);
      mockProfessorRepository.update.mockResolvedValue({ affected: 1 });
      mockProfessorRepository.findOneBy.mockResolvedValue(updatedProfessor);

      const result = await service.update(mockProfessor.id, updateDto);
      expect(result).toEqual(updatedProfessor);
      expect(mockProfessorRepository.update).toHaveBeenCalledWith(mockProfessor.id, updateDto);
      expect(mockProfessorRepository.findOneBy).toHaveBeenCalledWith({ id: mockProfessor.id });
    });

    it('should throw NotFoundException if professor not found', async () => {
      mockProfessorRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update('non-existent-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a professor', async () => {
      mockProfessorRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(mockProfessor.id)).resolves.toBeUndefined();
      expect(mockProfessorRepository.delete).toHaveBeenCalledWith(mockProfessor.id);
    });

    it('should throw NotFoundException if professor not found', async () => {
      mockProfessorRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
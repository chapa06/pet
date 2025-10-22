import { Test, TestingModule } from '@nestjs/testing';
import { LessonService } from './lesson.service';
import { LessonRepository } from './lesson.repository';
import { Lesson } from './lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { NotFoundException } from '@nestjs/common';

describe('LessonService', () => {
  let service: LessonService;
  let repository: LessonRepository;

  const mockLesson: Lesson = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    group: { id: 'group-uuid', name: 'Group A', students: [] } as any,
    professor: { id: 'professor-uuid', name: 'Александр', surname: 'Александров', patronymic: 'Александрович', dateOfBirth: new Date('1970-01-01') } as any,
  };

  const mockLessonRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonService,
        {
          provide: 'LessonRepository',
          useValue: mockLessonRepository,
        },
      ],
    }).compile();

    service = module.get<LessonService>(LessonService);
    repository = module.get<LessonRepository>('LessonRepository');
  });

  describe('createLesson', () => {
    it('should create and save a new lesson', async () => {
      const createDto: CreateLessonDto = {
        group_id: 'group-uuid',
        professor_id: 'professor-uuid',
      };

      mockLessonRepository.create.mockReturnValue(mockLesson);
      mockLessonRepository.save.mockResolvedValue(mockLesson);

      const result = await service.createLesson(createDto);
      expect(result).toEqual(mockLesson);
      expect(mockLessonRepository.create).toHaveBeenCalledWith({
        group: { id: createDto.group_id },
        professor: { id: createDto.professor_id },
      });
      expect(mockLessonRepository.save).toHaveBeenCalledWith(mockLesson);
    });
  });

  describe('findAll', () => {
    it('should return all lessons', async () => {
      const lessons = [mockLesson];
      mockLessonRepository.find.mockResolvedValue(lessons);

      const result = await service.findAll();
      expect(result).toEqual(lessons);
      expect(mockLessonRepository.find).toHaveBeenCalledWith({ relations: ['group', 'professor'] });
    });
  });

  describe('findOneById', () => {
    it('should return a lesson by id', async () => {
      mockLessonRepository.findOne.mockResolvedValue(mockLesson);

      const result = await service.findOneById(mockLesson.id);
      expect(result).toEqual(mockLesson);
      expect(mockLessonRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockLesson.id },
        relations: ['group', 'professor'],
      });
    });

    it('should throw NotFoundException if lesson not found', async () => {
      mockLessonRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneById('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a lesson', async () => {
      const updateDto: UpdateLessonDto = {
        group_id: 'new-group-uuid',
        professor_id: 'new-professor-uuid',
      };
      const updatedLesson = { ...mockLesson, group: { id: updateDto.group_id }, professor: { id: updateDto.professor_id } };

      mockLessonRepository.findOne.mockResolvedValue(mockLesson);
      mockLessonRepository.update.mockResolvedValue({ affected: 1 });
      mockLessonRepository.findOne.mockResolvedValue(updatedLesson);

      const result = await service.update(mockLesson.id, updateDto);
      expect(result).toEqual(updatedLesson);
      expect(mockLessonRepository.update).toHaveBeenCalledWith(mockLesson.id, updateDto);
      expect(mockLessonRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockLesson.id },
        relations: ['group', 'professor'],
      });
    });

    it('should throw NotFoundException if lesson not found', async () => {
      mockLessonRepository.findOne.mockResolvedValue(null);

      await expect(service.update('non-existent-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a lesson', async () => {
      mockLessonRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(mockLesson.id)).resolves.toBeUndefined();
      expect(mockLessonRepository.delete).toHaveBeenCalledWith(mockLesson.id);
    });

    it('should throw NotFoundException if lesson not found', async () => {
      mockLessonRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
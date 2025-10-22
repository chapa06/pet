import { Test, TestingModule } from '@nestjs/testing';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { Lesson } from './lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { NotFoundException } from '@nestjs/common';

describe('LessonController', () => {
  let controller: LessonController;
  let service: LessonService;

  const mockLesson: Lesson = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    group: { id: 'group-uuid', name: 'Group A', students: [] } as any,
    professor: { id: 'professor-uuid', name: 'Александр', surname: 'Александров', patronymic: 'Александрович', dateOfBirth: new Date('1970-01-01') } as any,
  };

  const mockLessonService = {
    createLesson: jest.fn(),
    findAll: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonController],
      providers: [
        {
          provide: LessonService,
          useValue: mockLessonService,
        },
      ],
    }).compile();

    controller = module.get<LessonController>(LessonController);
    service = module.get<LessonService>(LessonService);
  });

  describe('create', () => {
    it('должен создать новый урок', async () => {
      const createDto: CreateLessonDto = {
        group_id: 'group-uuid',
        professor_id: 'professor-uuid',
      };

      mockLessonService.createLesson.mockResolvedValue(mockLesson);

      const result = await controller.create(createDto);
      expect(result).toEqual(mockLesson);
      expect(mockLessonService.createLesson).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('должен вернуть массив уроков', async () => {
      const lessons = [mockLesson];
      mockLessonService.findAll.mockResolvedValue(lessons);

      const result = await controller.findAll();
      expect(result).toEqual(lessons);
      expect(mockLessonService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('должен вернуть урок по id', async () => {
      mockLessonService.findOneById.mockResolvedValue(mockLesson);

      const result = await controller.findOne(mockLesson.id);
      expect(result).toEqual(mockLesson);
      expect(mockLessonService.findOneById).toHaveBeenCalledWith(mockLesson.id);
    });

    it('должен выбросить NotFoundException, если урок не найден', async () => {
      mockLessonService.findOneById.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('должен обновить урок', async () => {
      const updateDto: UpdateLessonDto = {
        group_id: 'new-group-uuid',
        professor_id: 'new-professor-uuid',
      };
      const updatedLesson = { ...mockLesson, group: { id: updateDto.group_id }, professor: { id: updateDto.professor_id } };

      mockLessonService.update.mockResolvedValue(updatedLesson);

      const result = await controller.update(mockLesson.id, updateDto);
      expect(result).toEqual(updatedLesson);
      expect(mockLessonService.update).toHaveBeenCalledWith(mockLesson.id, updateDto);
    });

    it('должен выбросить NotFoundException, если урок не найден', async () => {
      mockLessonService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update('non-existent-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('должен удалить урок', async () => {
      mockLessonService.remove.mockResolvedValue(undefined);

      await expect(controller.remove(mockLesson.id)).resolves.toBeUndefined();
      expect(mockLessonService.remove).toHaveBeenCalledWith(mockLesson.id);
    });

    it('должен выбросить NotFoundException, если урок не найден', async () => {
      mockLessonService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
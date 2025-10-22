import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { Student } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { NotFoundException } from '@nestjs/common';

describe('StudentController', () => {
  let controller: StudentController;
  let service: StudentService;

  const mockStudent: Student = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Иван',
    surname: 'Иванов',
    dateOfBirth: new Date('2000-01-01'),
    groupId: 'group-uuid',
    group: { id: 'group-uuid', name: 'Group A', students: [] } as any,
  };

  const mockStudentService = {
    createStudent: jest.fn(),
    findAll: jest.fn(),
    findStudentById: jest.fn(),
    updateStudent: jest.fn(),
    deleteStudent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        {
          provide: StudentService,
          useValue: mockStudentService,
        },
      ],
    }).compile();

    controller = module.get<StudentController>(StudentController);
    service = module.get<StudentService>(StudentService);
  });

  describe('create', () => {
    it('должен создать нового студента', async () => {
      const createDto: CreateStudentDto = {
        name: 'Иван',
        surname: 'Иванов',
        dateOfBirth: '2000-01-01',
        groupId: 'group-uuid',
      };

      mockStudentService.createStudent.mockResolvedValue(mockStudent);

      const result = await controller.create(createDto);
      expect(result).toEqual(mockStudent);
      expect(mockStudentService.createStudent).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('должен вернуть массив студентов', async () => {
      const students = [mockStudent];
      mockStudentService.findAll.mockResolvedValue(students);

      const result = await controller.findAll();
      expect(result).toEqual(students);
      expect(mockStudentService.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('должен вернуть студента по id', async () => {
      mockStudentService.findStudentById.mockResolvedValue(mockStudent);

      const result = await controller.findById(mockStudent.id);
      expect(result).toEqual(mockStudent);
      expect(mockStudentService.findStudentById).toHaveBeenCalledWith(mockStudent.id);
    });

    it('должен выбросить NotFoundException, если студент не найден', async () => {
      mockStudentService.findStudentById.mockRejectedValue(new NotFoundException());

      await expect(controller.findById('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('должен обновить студента', async () => {
      const updateDto: UpdateStudentDto = {
        name: 'Иван',
        surname: 'Иванов',
        dateOfBirth: '2000-02-02',
        groupId: 'new-group-uuid',
      };
      const updatedStudent = { ...mockStudent, ...updateDto };
      mockStudentService.updateStudent.mockResolvedValue(updatedStudent);

      const result = await controller.update(mockStudent.id, updateDto);
      expect(result).toEqual(updatedStudent);
      expect(mockStudentService.updateStudent).toHaveBeenCalledWith(mockStudent.id, updateDto);
    });

    it('должен выбросить NotFoundException, если студент не найден', async () => {
      mockStudentService.updateStudent.mockRejectedValue(new NotFoundException());

      await expect(controller.update('non-existent-id', {
        name: undefined,
        surname: undefined, 
        dateOfBirth: undefined,
        groupId: undefined,
      } as UpdateStudentDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('должен удалить студента', async () => {
      mockStudentService.deleteStudent.mockResolvedValue(undefined);

      await expect(controller.delete(mockStudent.id)).resolves.toBeUndefined();
      expect(mockStudentService.deleteStudent).toHaveBeenCalledWith(mockStudent.id);
    });

    it('должен выбросить NotFoundException, если студент не найден', async () => {
      mockStudentService.deleteStudent.mockRejectedValue(new NotFoundException());

      await expect(controller.delete('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
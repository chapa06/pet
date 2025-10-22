import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { StudentRepository } from './student.repository';
import { Student } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { NotFoundException } from '@nestjs/common';

describe('StudentService', () => {
  let service: StudentService;
  let repository: StudentRepository;

  const mockStudent: Student = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Иван',
    surname: 'Иванов',
    dateOfBirth: new Date('2000-01-01'),
    groupId: 'group-uuid',
    group: { id: 'group-uuid', name: 'Group A', students: [] } as any,
  };

  const mockStudentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    merge: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      innerJoin: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
    findStudentsByGroupName: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: 'StudentRepository',
          useValue: mockStudentRepository,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    repository = module.get<StudentRepository>('StudentRepository');
  });

  describe('createStudent', () => {
    it('should create and save a new student', async () => {
      const createDto: CreateStudentDto = {
        name: 'Иван',
        surname: 'Иванов',
        dateOfBirth: '2000-01-01',
        groupId: 'group-uuid',
      };

      mockStudentRepository.create.mockReturnValue(mockStudent);
      mockStudentRepository.save.mockResolvedValue(mockStudent);

      const result = await service.createStudent(createDto);
      expect(result).toEqual(mockStudent);
      expect(mockStudentRepository.create).toHaveBeenCalledWith({
        ...createDto,
        dateOfBirth: new Date(createDto.dateOfBirth),
        group: { id: createDto.groupId },
      });
      expect(mockStudentRepository.save).toHaveBeenCalledWith(mockStudent);
    });
  });

  describe('findAll', () => {
    it('should return all students', async () => {
      const students = [mockStudent];
      mockStudentRepository.find.mockResolvedValue(students);

      const result = await service.findAll();
      expect(result).toEqual(students);
      expect(mockStudentRepository.find).toHaveBeenCalled();
    });
  });

  describe('findStudentById', () => {
    it('should return a student by id', async () => {
      mockStudentRepository.findOneBy.mockResolvedValue(mockStudent);

      const result = await service.findStudentById(mockStudent.id);
      expect(result).toEqual(mockStudent);
      expect(mockStudentRepository.findOneBy).toHaveBeenCalledWith({ id: mockStudent.id });
    });

    it('should throw NotFoundException if student not found', async () => {
      mockStudentRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findStudentById('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStudent', () => {
    it('should update a student with all fields', async () => {
      const updateDto: UpdateStudentDto = {
        name: 'Иван',
        surname: 'Иванов',
        dateOfBirth: '2000-02-02',
        groupId: 'new-group-uuid',
      };
      const updatedStudent = {
        ...mockStudent,
        ...updateDto,
        dateOfBirth: updateDto.dateOfBirth ? new Date(updateDto.dateOfBirth) : mockStudent.dateOfBirth,
        group: updateDto.groupId ? { id: updateDto.groupId } : mockStudent.group,
      };

      mockStudentRepository.findOneBy.mockResolvedValue(mockStudent);
      mockStudentRepository.merge.mockReturnValue(updatedStudent);
      mockStudentRepository.save.mockResolvedValue(updatedStudent);

      const result = await service.updateStudent(mockStudent.id, updateDto);
      expect(result).toEqual(updatedStudent);
      expect(mockStudentRepository.merge).toHaveBeenCalledWith(mockStudent, expect.objectContaining({
        name: updateDto.name,
        surname: updateDto.surname,
        dateOfBirth: updateDto.dateOfBirth ? new Date(updateDto.dateOfBirth) : undefined,
        group: updateDto.groupId ? { id: updateDto.groupId } : undefined,
      }));
      expect(mockStudentRepository.save).toHaveBeenCalledWith(updatedStudent);
    });

    it('should update a student with partial fields', async () => {
      const updateDto: UpdateStudentDto = {
        name: 'Иван',
        dateOfBirth: undefined,
        groupId: undefined,
      };
      const updatedStudent = {
        ...mockStudent,
        name: updateDto.name,
        dateOfBirth: mockStudent.dateOfBirth, // Remains unchanged since dateOfBirth is undefined
        group: mockStudent.group,
      };

      mockStudentRepository.findOneBy.mockResolvedValue(mockStudent);
      mockStudentRepository.merge.mockImplementation((student, updatedData) => {
        const mergedData = { ...student, ...updatedData };
        if (updatedData.dateOfBirth) {
          mergedData.dateOfBirth = new Date(updatedData.dateOfBirth);
        }
        if (updatedData.groupId) {
          mergedData.group = { id: updatedData.groupId };
        }
        return mergedData;
      });
      mockStudentRepository.save.mockResolvedValue(updatedStudent);

      const result = await service.updateStudent(mockStudent.id, updateDto);
      expect(result).toEqual(updatedStudent);
      expect(mockStudentRepository.merge).toHaveBeenCalledWith(mockStudent, expect.objectContaining({
        name: updateDto.name,
      }));
      expect(mockStudentRepository.save).toHaveBeenCalledWith(updatedStudent);
    });

    it('should throw NotFoundException if student not found', async () => {
      mockStudentRepository.findOneBy.mockResolvedValue(null);

      await expect(service.updateStudent('non-existent-id', {
        name: undefined,
        surname: undefined,
        dateOfBirth: undefined,
        groupId: undefined,
      })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteStudent', () => {
    it('should delete a student', async () => {
      mockStudentRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.deleteStudent(mockStudent.id)).resolves.toBeUndefined();
      expect(mockStudentRepository.delete).toHaveBeenCalledWith(mockStudent.id);
    });

    it('should throw NotFoundException if student not found', async () => {
      mockStudentRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteStudent('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStudentsInGroup', () => {
    it('should return students in a group', async () => {
      const students = [mockStudent];
      mockStudentRepository.findStudentsByGroupName.mockResolvedValue(students);
      mockStudentRepository.createQueryBuilder.mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(students),
      });

      const result = await service.getStudentsInGroup('Group A');
      expect(result).toEqual(students);
      expect(mockStudentRepository.findStudentsByGroupName).toHaveBeenCalledWith('Group A');
    });
  });
});
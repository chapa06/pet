import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {Student} from './student.entity'
import { StudentRepository } from './student.repository';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { DATA_SOURCE_TOKEN } from 'src/database/database.provider';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class StudentService {
    constructor(
    @Inject('StudentRepository')
    private studentRepository: StudentRepository,
  ) {}
    async createStudent(Dto: CreateStudentDto): Promise<Student>{
        const newStudent = this.studentRepository.create({...Dto,
            dateOfBirth: new Date(Dto.dateOfBirth),
            group: { id: Dto.groupId } as any,});
        return this.studentRepository.save(newStudent);
    }

    async findAll(): Promise<Student[]>{
        return this.studentRepository.find();
    }

    async getStudentsInGroup(groupName: string): Promise<Student[]> {
        return this.studentRepository.findStudentsByGroupName(groupName);
    }

    async findStudentById(id: string): Promise<Student>{
        const student = await this.studentRepository.findOneBy({id});
        if(!student){throw new NotFoundException(`студент с id${id} не найден`);}
        return student;
    }

    async updateStudent(id: string, Dto: UpdateStudentDto): Promise<Student>{
        const student = await this.findStudentById(id);
        const { dateOfBirth, groupId, ...restData } = Dto;
        const updatedData: Partial<Student> = { ...restData as Partial<Student> };
        if (dateOfBirth) {
            updatedData.dateOfBirth = new Date(dateOfBirth);
        }
        
        if (groupId) {
            updatedData.group = { id: groupId } as any; 
        }

        const mergedStudent = this.studentRepository.merge(student, updatedData);
        return this.studentRepository.save(mergedStudent);
    }

    async deleteStudent(id: string): Promise<void>{
        const result = await this.studentRepository.delete(id);
        if(result.affected === 0){throw new NotFoundException(`студент с ${id} не найден для удаления`);}
    }
}

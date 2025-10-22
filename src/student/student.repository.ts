import { Repository } from 'typeorm';
import { Student } from './student.entity';

export class StudentRepository extends Repository<Student>{
   
    async findStudentsByGroupName(groupName: string): Promise<Student[]> {
    return this.createQueryBuilder('student')
        .innerJoin('student.group', 'group', 'group.name = :groupName', { groupName })
        .getMany();}
}
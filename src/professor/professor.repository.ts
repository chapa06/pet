import { Repository } from 'typeorm';
import { Professor } from './professor.entity';

export class ProfessorRepository extends Repository<Professor>{
    
    async findProfessorWithGroups(professorName: string): Promise<Professor[]> {
    return this.createQueryBuilder('professor')
        .where('professor.name = :name', { name: professorName })
        .innerJoin('professor.lesson', 'lesson')
        .innerJoinAndSelect('lesson.group', 'group')
        .getMany();}
}
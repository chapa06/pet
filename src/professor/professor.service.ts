import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Professor } from './professor.entity';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { ProfessorRepository } from './professor.repository';
import { DATA_SOURCE_TOKEN } from 'src/database/database.provider';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProfessorService {
  constructor(
    @Inject('ProfessorRepository')
      private professorRepository: ProfessorRepository,
    ) {}

  async create(createProfessorDto: CreateProfessorDto): Promise<Professor> {
    const newProfessor = this.professorRepository.create({
      ...createProfessorDto,
      dateOfBirth: new Date(createProfessorDto.dateOfBirth),
      });
    return this.professorRepository.save(newProfessor);
  }

  async findAll(): Promise<Professor[]> {
    return this.professorRepository.find({
    });
  }

  async findOneById(id: string): Promise<Professor> {
    const professor = await this.professorRepository.findOneBy({id});
    
    if (!professor) {
      throw new NotFoundException(`Профессор с ID: "${id}" не найден.`);
    }

    return professor;
  }

  async update(id: string, updateProfessorDto: UpdateProfessorDto): Promise<Professor> {
    await this.findOneById(id); 
    await this.professorRepository.update(id, updateProfessorDto as any); 
    return this.findOneById(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.professorRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Профессор с ID: "${id}" не найден.`);
    }
  }
}
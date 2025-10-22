import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProfessorController } from './professor.controller';
import { ProfessorService } from './professor.service';
import { Professor } from './professor.entity';
import { ProfessorRepository } from './professor.repository'
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Professor, ProfessorRepository]),
  ],
  controllers: [
    ProfessorController,
  ],
  providers: [
    ProfessorService,
    ProfessorRepository
  ],
  exports: [ProfessorService, ProfessorRepository] 
})
export class ProfessorModule {}
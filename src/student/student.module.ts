import { Module } from '@nestjs/common'; 
import { DataSource } from 'typeorm';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { Student } from './student.entity';
import { StudentRepository } from './student.repository'
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, StudentRepository]),
  ],
  controllers: [
    StudentController,
  ],
  providers: [
    StudentService,
    StudentRepository
  ],
  exports: [StudentService, StudentRepository] 
})
export class StudentModule {}
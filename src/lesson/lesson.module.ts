import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { Lesson } from './lesson.entity';
import { LessonRepository } from './lesson.repository'
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson, LessonRepository]),
  ],
  controllers: [
   LessonController,
  ],
  providers: [
    LessonService, LessonRepository
  ],
  exports: [LessonService, LessonRepository] 
})
export class LessonModule {}
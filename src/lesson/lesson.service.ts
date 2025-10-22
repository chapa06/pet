import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Lesson } from './lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonRepository } from './lesson.repository';
import { DATA_SOURCE_TOKEN } from 'src/database/database.provider';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LessonService {
   constructor(
     @Inject('LessonRepository')
        private lessonRepository: LessonRepository,
      ) {}

  async createLesson(createLessonDto: CreateLessonDto): Promise<Lesson> {
    const lessonData = {
      group: { id: createLessonDto.group_id },
      professor: { id: createLessonDto.professor_id },
    };
    const newLesson = this.lessonRepository.create(lessonData);
    return this.lessonRepository.save(newLesson);
  }

  async findAll(): Promise<Lesson[]> {
    return this.lessonRepository.find({
        relations: ['group', 'professor'],
    });
  }

  async findOneById(id: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
        where: { id },
        relations: ['group', 'professor'],
    });
    
    if (!lesson) {
      throw new NotFoundException(`Урок с ID "${id}" не найден.`);
    }

    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
    await this.findOneById(id);
    await this.lessonRepository.update(id, updateLessonDto as any); 
    return this.findOneById(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.lessonRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Урок с ID "${id}" не найден.`);
    }
  }
}
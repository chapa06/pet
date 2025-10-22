import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StudentService } from './student/student.service';
import { StudentController } from './student/student.controller';
import { StudentModule } from './student/student.module';
import { ProfessorModule } from './professor/professor.module';
import { GroupService } from './group/group.service';
import { GroupController } from './group/group.controller';
import { LessonController } from './lesson/lesson.controller';
import { LessonService } from './lesson/lesson.service';
import { LessonModule } from './lesson/lesson.module';
import { GroupModule } from './group/group.module';
import { ProfessorController } from './professor/professor.controller';
import { ProfessorService } from './professor/professor.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }), TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'pet_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migration/*.ts'],
      synchronize: false, // В проде false, для разработки можно true
      logging: true,
      connectTimeoutMS: 10000,
    }),
    StudentModule,
    ProfessorModule,
    LessonModule,
    GroupModule
  ]})
export class AppModule {}
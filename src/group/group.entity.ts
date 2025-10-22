import { Entity, Column, PrimaryGeneratedColumn, JoinTable, OneToMany, OneToOne} from 'typeorm';
import { Student } from '../student/student.entity';
import {Lesson} from '../lesson/lesson.entity'
@Entity('group')
export class Group{
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @OneToMany(() => Student, (student) => student.group)
    students?: Student[]; 

     @OneToMany(() => Lesson, (lesson) => lesson.group)
    lessons!: Lesson[];
}
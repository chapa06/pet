import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, OneToOne} from 'typeorm';
import { Student } from '../student/student.entity';
import { Lesson } from 'src/lesson/lesson.entity';

@Entity('professor')
export class Professor{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    surname!: string;
 
    @Column()
    patronymic!: string;

    @Column("date")
    dateOfBirth!: Date;

    @OneToMany(() =>Lesson,(lesson) =>lesson.professor)
    lessons!: Lesson[];
}
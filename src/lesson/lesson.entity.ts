import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne} from 'typeorm';
import { Student } from '../student/student.entity';
import { Group } from 'src/group/group.entity';
import { Professor } from 'src/professor/professor.entity';

@Entity('lesson')
export class Lesson {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(()=> Group , (group) => group.lessons)
    @JoinColumn({name: 'group_id'})
    group!:Group;

    @ManyToOne(()=> Professor, (professor) => professor.lessons)
    @JoinColumn({name: 'professor_id'})
    professor!: Professor;
}
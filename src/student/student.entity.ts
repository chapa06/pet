import { Group } from 'src/group/group.entity';
import { Professor } from 'src/professor/professor.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne } from 'typeorm';

@Entity('student')
export class Student{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    surname!: string;

    @Column("date")
    dateOfBirth!: Date;

    @Column({ nullable: true })
    groupId!: string;

    @ManyToOne(() => Group, (group) => group.students)
    group!: Group;
    
}
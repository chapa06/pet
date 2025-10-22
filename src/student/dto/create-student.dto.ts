import { IsNotEmpty, IsString, IsDateString, IsUUID } from 'class-validator';
export class CreateStudentDto{
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    @IsNotEmpty()
    surname: string;

    @IsUUID() 
    @IsNotEmpty()
    groupId: string;

    @IsDateString()
    dateOfBirth: string; 
}
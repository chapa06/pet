import { IsString, IsDateString, IsUUID, IsOptional } from 'class-validator';
export class UpdateStudentDto{
    @IsString()
    @IsOptional()
    name?: string;
    
    @IsString()
    @IsOptional()
    surname?: string;

    @IsUUID() 
    @IsOptional()
    groupId?: string;

    @IsDateString()
    @IsOptional()
    dateOfBirth?: string; 
}
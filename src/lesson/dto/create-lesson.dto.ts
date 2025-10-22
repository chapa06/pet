import { IsNotEmpty, IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsUUID()
  group_id!: string;

  @IsNotEmpty()
  @IsUUID()
  professor_id!: string;
 
  
}
import { IsString, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateProfessorDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  surname!: string;

  @IsNotEmpty()
  @IsString()
  patronymic!: string;

  @IsNotEmpty()
  @IsDateString() 
  dateOfBirth!: string;
}
import { IsString, IsDateString, IsOptional } from 'class-validator';

export class UpdateProfessorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsString()
  patronymic?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}
import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { Professor } from './professor.entity';

@Controller('professors')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfessorDto: CreateProfessorDto): Promise<Professor> {
    return this.professorService.create(createProfessorDto);
  }

  @Get()
  findAll(): Promise<Professor[]> {
    return this.professorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Professor> {
    return this.professorService.findOneById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProfessorDto: UpdateProfessorDto): Promise<Professor> {
    return this.professorService.update(id, updateProfessorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.professorService.remove(id);
  }
}
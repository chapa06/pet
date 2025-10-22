import { 
    Controller, 
    Get, 
    Post, 
    Put, 
    Delete, 
    Body, 
    Param, 
    HttpCode, 
    HttpStatus 
} from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentController {
    constructor(private readonly studentService: StudentService){}

    @Post()
    async create(@Body() dto: CreateStudentDto): Promise<Student>{
        return this.studentService.createStudent(dto)
    }

    @Get()
    async findAll(): Promise<Student[]>{
        return this.studentService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<Student>{
        return this.studentService.findStudentById(id);
    }

    @Put(':id')
    async update(
        @Param('id')id: string,
        @Body()dto: UpdateStudentDto
    ):Promise<Student>{
        return this.studentService.updateStudent(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id')id: string): Promise<void>{
        return this.studentService.deleteStudent(id);
    }
}


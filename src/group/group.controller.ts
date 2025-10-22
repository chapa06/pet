import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  HttpCode,
  HttpStatus, 
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './group.entity';

@Controller('groups') // Note the plural form is common practice
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  // POST /groups
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupService.create(createGroupDto);
  }

  // GET /groups
  @Get()
  findAll(): Promise<Group[]> {
    return this.groupService.findAll();
  }

  // GET /groups/:id
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Group> {
    return this.groupService.findOneById(id);
  }

  // PATCH /groups/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto): Promise<Group> {
    return this.groupService.update(id, updateGroupDto);
  }

  // DELETE /groups/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Use 204 No Content for successful deletion
  remove(@Param('id') id: string): Promise<void> {
    return this.groupService.remove(id);
  }
}
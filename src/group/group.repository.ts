import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Group } from './group.entity';


@Injectable()
export class GroupRepository extends Repository<Group> {
    
    
}
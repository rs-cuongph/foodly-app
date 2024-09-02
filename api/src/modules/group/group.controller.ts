import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateGroupDTO } from './dto/create.dto';
import { RequestWithUser } from 'src/types/requests.type';
import { GroupService } from './group.service';
import { EditGroupDTO } from './dto/edit.dto';
import { SearchGroupDTO } from './dto/search.dto';
import { QueryShowGroupDTO } from './dto/show.dto';

@Controller('groups')
@ApiTags('groups')
export class GroupController {
  constructor(private groupService: GroupService) {}
  @Post('/')
  create(@Body() body: CreateGroupDTO, @Req() request: RequestWithUser) {
    return this.groupService.create(body, request.user);
  }

  @Put('/:id')
  edit(
    @Param('id') id: string,
    @Body() body: EditGroupDTO,
    @Req() request: RequestWithUser,
  ) {
    return this.groupService.edit(id, body, request.user);
  }

  @Get('/:id')
  show(@Param('id') id: string, @Query() query: QueryShowGroupDTO) {
    return this.groupService.show(id, query);
  }

  @Delete('/:id')
  delete(@Param('id') id: string, @Req() request: RequestWithUser) {
    return this.groupService.delete(id, request.user);
  }

  @Get('/')
  search(@Query() query: SearchGroupDTO, @Req() request: RequestWithUser) {
    return this.groupService.search(query, request.user);
  }
}

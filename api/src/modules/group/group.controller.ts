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
import { CreateGroupDto } from './dto/create.dto';
import { RequestWithUser } from 'src/types/requests.type';
import { GroupService } from './group.service';
import { EditGroupDto } from './dto/edit.dto';
import { SearchGroupDTO } from './dto/search.dto';

@Controller('groups')
@ApiTags('groups')
export class GroupController {
  constructor(private groupService: GroupService) {}
  @Post('/')
  create(@Body() body: CreateGroupDto, @Req() request: RequestWithUser) {
    return this.groupService.create(body, request.user);
  }

  @Put('/:id')
  edit(
    @Param('id') id: string,
    @Body() body: EditGroupDto,
    @Req() request: RequestWithUser,
  ) {
    return this.groupService.edit(id, body, request.user);
  }

  @Get('/:id')
  show(@Param('id') id: string) {
    return this.groupService.show(id);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.groupService.delete(id);
  }

  @Get('/')
  search(@Query() query: SearchGroupDTO, @Req() request: RequestWithUser) {
    return this.groupService.search(query, request.user);
  }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { RequestWithUser } from 'src/types/requests.type';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { QueryMessagesDto } from './dto/query-messages.dto';

@Controller('chat')
@UseGuards(JwtAccessTokenGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Message endpoints
  @Get('messages/:roomId')
  async getMessages(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Req() request: RequestWithUser,
    @Query() query: QueryMessagesDto,
  ) {
    return this.chatService.getMessages(roomId, request.user.id, query);
  }

  @Get('messages/:roomId/history')
  async getMessageHistory(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Req() request: RequestWithUser,
    @Query() query: QueryMessagesDto,
  ) {
    return this.chatService.getMessageHistory(roomId, request.user.id, query);
  }

  @Post('messages')
  async createMessage(
    @Req() request: RequestWithUser,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.chatService.createMessage(request.user.id, createMessageDto);
  }

  @Put('messages/:messageId')
  async updateMessage(
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @Req() request: RequestWithUser,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.chatService.updateMessage(
      messageId,
      request.user.id,
      updateMessageDto,
    );
  }

  @Delete('messages/:messageId')
  async deleteMessage(
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @Req() request: RequestWithUser,
  ) {
    return this.chatService.deleteMessage(messageId, request.user.id);
  }

  // Room endpoints
  @Get('rooms')
  async getUserRooms(@Req() request: RequestWithUser) {
    return this.chatService.getUserRooms(request.user.id);
  }

  @Get('rooms/:roomId')
  async getRoomById(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Req() request: RequestWithUser,
  ) {
    return this.chatService.getRoomById(roomId, request.user.id);
  }

  @Post('rooms')
  async createRoom(
    @Req() request: RequestWithUser,
    @Body() createRoomDto: CreateRoomDto,
  ) {
    return this.chatService.createRoom(request.user.id, createRoomDto);
  }

  @Put('rooms/:roomId')
  async updateRoom(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Req() request: RequestWithUser,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.chatService.updateRoom(roomId, request.user.id, updateRoomDto);
  }

  @Delete('rooms/:roomId')
  async deleteRoom(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Req() request: RequestWithUser,
  ) {
    return this.chatService.deleteRoom(roomId, request.user.id);
  }

  // User preferences endpoints
  @Get('preferences')
  async getUserPreferences(@Req() request: RequestWithUser) {
    return this.chatService.getUserPreferences(request.user.id);
  }

  @Put('preferences')
  async updateUserPreferences(
    @Req() request: RequestWithUser,
    @Body() updatePreferencesDto: UpdateUserPreferencesDto,
  ) {
    return this.chatService.updateUserPreferences(
      request.user.id,
      updatePreferencesDto,
    );
  }
}

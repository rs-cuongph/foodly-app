import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { QueryMessagesDto } from './dto/query-messages.dto';
import { ExtendedPrismaClient } from 'src/services/prisma.extension';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class ChatService {
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  // Message endpoints
  async getMessages(roomId: string, userId: string, query: QueryMessagesDto) {
    // Check if user has access to the room
    await this.validateUserRoomAccess(userId, roomId);

    const skip = ((query.page || 1) - 1) * (query.limit || 20);
    const take = query.limit || 20;

    const whereClause: any = {
      room_id: roomId,
      deleted_at: null,
    };

    if (query.before) {
      whereClause.created_at = {
        ...whereClause.created_at,
        lt: new Date(query.before),
      };
    }

    if (query.after) {
      whereClause.created_at = {
        ...whereClause.created_at,
        gt: new Date(query.after),
      };
    }

    const [messages, totalCount] = await Promise.all([
      this.prismaService.client.chatMessage.findMany({
        where: whereClause,
        include: {
          sender: {
            select: {
              id: true,
              display_name: true,
              avatar: true,
            },
          },
          read_by: {
            where: { user_id: userId },
            select: { read_at: true },
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take,
      }),
      this.prismaService.client.chatMessage.count({ where: whereClause }),
    ]);

    return {
      data: messages,
      pagination: {
        page: query.page || 1,
        limit: query.limit || 20,
        total: totalCount,
        totalPages: Math.ceil(totalCount / (query.limit || 20)),
      },
    };
  }

  async getMessageHistory(
    roomId: string,
    userId: string,
    query: QueryMessagesDto,
  ) {
    return this.getMessages(roomId, userId, query);
  }

  async createMessage(userId: string, createMessageDto: CreateMessageDto) {
    // Validate user has access to room
    await this.validateUserRoomAccess(userId, createMessageDto.room_id);

    const message = await this.prismaService.client.chatMessage.create({
      data: {
        room_id: createMessageDto.room_id,
        sender_id: userId,
        content: createMessageDto.content,
        type: createMessageDto.type,
        metadata: createMessageDto.metadata,
      },
      include: {
        sender: {
          select: {
            id: true,
            display_name: true,
            avatar: true,
          },
        },
      },
    });

    // Update room's last message
    await this.prismaService.client.chatRoom.update({
      where: { id: createMessageDto.room_id },
      data: { last_message_id: message.id },
    });

    return message;
  }

  async updateMessage(
    messageId: string,
    userId: string,
    updateMessageDto: UpdateMessageDto,
  ) {
    const message = await this.prismaService.client.chatMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.sender_id !== userId) {
      throw new ForbiddenException('You can only update your own messages');
    }

    if (message.deleted_at) {
      throw new BadRequestException('Cannot update deleted message');
    }

    return this.prismaService.client.chatMessage.update({
      where: { id: messageId },
      data: {
        content: updateMessageDto.content,
        metadata: updateMessageDto.metadata,
        updated_at: new Date(),
      },
      include: {
        sender: {
          select: {
            id: true,
            display_name: true,
            avatar: true,
          },
        },
      },
    });
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.prismaService.client.chatMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.sender_id !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    return this.prismaService.client.chatMessage.update({
      where: { id: messageId },
      data: { deleted_at: new Date() },
    });
  }

  // Room endpoints
  async getUserRooms(userId: string) {
    const participant =
      await this.prismaService.client.chatRoomParticipant.findMany({
        where: {
          user_id: userId,
          left_at: null,
        },
        include: {
          room: {
            include: {
              last_message: {
                include: {
                  sender: {
                    select: {
                      id: true,
                      display_name: true,
                      avatar: true,
                    },
                  },
                },
              },
              participants: {
                where: { left_at: null },
                include: {
                  user: {
                    select: {
                      id: true,
                      display_name: true,
                      avatar: true,
                    },
                  },
                },
              },
              _count: {
                select: { messages: true },
              },
            },
          },
        },
        orderBy: {
          room: {
            updated_at: 'desc',
          },
        },
      });

    return participant.map((p) => p.room);
  }

  async getRoomById(roomId: string, userId: string) {
    await this.validateUserRoomAccess(userId, roomId);

    return this.prismaService.client.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        participants: {
          where: { left_at: null },
          include: {
            user: {
              select: {
                id: true,
                display_name: true,
                avatar: true,
                role: true,
              },
            },
          },
        },
        last_message: {
          include: {
            sender: {
              select: {
                id: true,
                display_name: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: { messages: true },
        },
      },
    });
  }

  async createRoom(userId: string, createRoomDto: CreateRoomDto) {
    const user = await this.prismaService.client.user.findUnique({
      where: { id: userId },
      select: { organization_id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const room = await this.prismaService.client.chatRoom.create({
      data: {
        name: createRoomDto.name,
        type: createRoomDto.type,
        organization_id: user.organization_id,
        created_by_id: userId,
      },
    });

    // Add creator as admin participant
    await this.prismaService.client.chatRoomParticipant.create({
      data: {
        room_id: room.id,
        user_id: userId,
        role: 'ADMIN',
      },
    });

    // Add other participants if provided
    if (
      createRoomDto.participant_ids &&
      createRoomDto.participant_ids.length > 0
    ) {
      const participantData = createRoomDto.participant_ids.map(
        (participantId) => ({
          room_id: room.id,
          user_id: participantId,
          role: 'MEMBER' as const,
        }),
      );

      await this.prismaService.client.chatRoomParticipant.createMany({
        data: participantData,
      });
    }

    return this.getRoomById(room.id, userId);
  }

  async updateRoom(
    roomId: string,
    userId: string,
    updateRoomDto: UpdateRoomDto,
  ) {
    await this.validateUserRoomAdmin(userId, roomId);

    return this.prismaService.client.chatRoom.update({
      where: { id: roomId },
      data: {
        name: updateRoomDto.name,
        updated_at: new Date(),
      },
      include: {
        participants: {
          where: { left_at: null },
          include: {
            user: {
              select: {
                id: true,
                display_name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  async deleteRoom(roomId: string, userId: string) {
    await this.validateUserRoomAdmin(userId, roomId);

    return this.prismaService.client.chatRoom.update({
      where: { id: roomId },
      data: { deleted_at: new Date() },
    });
  }

  // User preferences endpoints
  async getUserPreferences(userId: string) {
    let preferences =
      await this.prismaService.client.userChatPreference.findUnique({
        where: { user_id: userId },
      });

    if (!preferences) {
      preferences = await this.prismaService.client.userChatPreference.create({
        data: { user_id: userId },
      });
    }

    return preferences;
  }

  async updateUserPreferences(
    userId: string,
    updatePreferencesDto: UpdateUserPreferencesDto,
  ) {
    return this.prismaService.client.userChatPreference.upsert({
      where: { user_id: userId },
      update: {
        notifications: updatePreferencesDto.notifications,
        sound_enabled: updatePreferencesDto.sound_enabled,
        updated_at: new Date(),
      },
      create: {
        user_id: userId,
        notifications: updatePreferencesDto.notifications ?? true,
        sound_enabled: updatePreferencesDto.sound_enabled ?? true,
      },
    });
  }

  // Helper methods
  private async validateUserRoomAccess(userId: string, roomId: string) {
    const participant =
      await this.prismaService.client.chatRoomParticipant.findFirst({
        where: {
          user_id: userId,
          room_id: roomId,
          left_at: null,
        },
      });

    if (!participant) {
      throw new ForbiddenException('You do not have access to this room');
    }

    return participant;
  }

  private async validateUserRoomAdmin(userId: string, roomId: string) {
    const participant = await this.validateUserRoomAccess(userId, roomId);

    if (participant.role !== 'ADMIN') {
      throw new ForbiddenException(
        'You must be an admin to perform this action',
      );
    }

    return participant;
  }
}

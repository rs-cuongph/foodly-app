import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

interface User {
  id: string;
  username: string;
  socketId: string;
  lastSeen: Date;
  isOnline: boolean;
  currentRoom?: string;
}

interface Room {
  id: string;
  name: string;
  users: Set<string>;
  createdAt: Date;
  lastActivity: Date;
}

interface Message {
  id: string;
  username?: string;
  message: string;
  room: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  isPrivate?: boolean;
  from?: string;
  to?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');
  private connectedUsers = new Map<string, User>();
  private rooms = new Map<string, Room>();
  private userRooms = new Map<string, Set<string>>(); // socketId -> rooms
  private typingUsers = new Map<string, Set<string>>(); // room -> users typing

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    // Send initial data to the connected client
    this.emitOnlineUsers();
    this.emitAvailableRooms(client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    const user = this.connectedUsers.get(client.id);
    if (user) {
      // Update user status
      user.isOnline = false;
      user.lastSeen = new Date();

      // Remove from all rooms
      const userRoomSet = this.userRooms.get(client.id);
      if (userRoomSet) {
        userRoomSet.forEach((roomId) => {
          this.handleLeaveRoom({ room: roomId }, client);
        });
      }

      // Clean up
      this.connectedUsers.delete(client.id);
      this.userRooms.delete(client.id);

      // Notify others
      this.emitOnlineUsers();

      this.logger.log(`User ${user.username} disconnected`);
    }
  }

  @SubscribeMessage('register-user')
  handleRegisterUser(
    @MessageBody() data: { username: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { username } = data;

    const user: User = {
      id: Date.now().toString(),
      username,
      socketId: client.id,
      lastSeen: new Date(),
      isOnline: true,
    };

    this.connectedUsers.set(client.id, user);
    this.userRooms.set(client.id, new Set());

    client.emit('user-registered', { user });
    this.emitOnlineUsers();

    this.logger.log(`User registered: ${username}`);
  }

  @SubscribeMessage('create-room')
  handleCreateRoom(
    @MessageBody() data: { roomName: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomName } = data;
    const user = this.connectedUsers.get(client.id);

    if (!user) {
      client.emit('error', { message: 'User not registered' });
      return;
    }

    const roomId = `room_${Date.now()}`;
    const room: Room = {
      id: roomId,
      name: roomName,
      users: new Set([client.id]),
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    this.rooms.set(roomId, room);
    client.join(roomId);

    const userRoomSet = this.userRooms.get(client.id);
    userRoomSet?.add(roomId);

    user.currentRoom = roomId;

    client.emit('room-created', { room: this.serializeRoom(room) });
    this.server.emit('room-list-updated', this.getAvailableRooms());

    this.logger.log(`Room created: ${roomName} by ${user.username}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { room: roomId } = data;
    const user = this.connectedUsers.get(client.id);

    if (!user) {
      client.emit('error', { message: 'User not registered' });
      return;
    }

    let room = this.rooms.get(roomId);
    if (!room) {
      // Create room if it doesn't exist
      room = {
        id: roomId,
        name: roomId,
        users: new Set(),
        createdAt: new Date(),
        lastActivity: new Date(),
      };
      this.rooms.set(roomId, room);
    }

    room.users.add(client.id);
    room.lastActivity = new Date();
    client.join(roomId);

    const userRoomSet = this.userRooms.get(client.id);
    userRoomSet?.add(roomId);

    user.currentRoom = roomId;

    // Notify room members
    client.to(roomId).emit('user-joined', {
      username: user.username,
      message: `${user.username} joined the room`,
      timestamp: new Date(),
      room: roomId,
    });

    // Send room info to user
    client.emit('room-joined', {
      room: this.serializeRoom(room),
      users: this.getRoomUsers(roomId),
    });

    // Update room user list for all members
    this.server
      .to(roomId)
      .emit('room-users-updated', this.getRoomUsers(roomId));

    this.logger.log(`${user.username} joined room: ${roomId}`);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { room: roomId } = data;
    const user = this.connectedUsers.get(client.id);

    if (!user) return;

    const room = this.rooms.get(roomId);
    if (room) {
      room.users.delete(client.id);
      room.lastActivity = new Date();

      client.leave(roomId);

      const userRoomSet = this.userRooms.get(client.id);
      userRoomSet?.delete(roomId);

      if (user.currentRoom === roomId) {
        user.currentRoom = undefined;
      }

      // Notify room members
      client.to(roomId).emit('user-left', {
        username: user.username,
        message: `${user.username} left the room`,
        timestamp: new Date(),
        room: roomId,
      });

      // Update room user list
      this.server
        .to(roomId)
        .emit('room-users-updated', this.getRoomUsers(roomId));

      // Remove room if empty
      if (room.users.size === 0) {
        this.rooms.delete(roomId);
        this.server.emit('room-list-updated', this.getAvailableRooms());
      }
    }

    client.emit('room-left', { room: roomId });
    this.logger.log(`${user.username} left room: ${roomId}`);
  }

  @SubscribeMessage('send-message')
  handleMessage(
    @MessageBody() data: { message: string; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { message, room } = data;
    const user = this.connectedUsers.get(client.id);

    if (!user) {
      client.emit('error', { message: 'User not registered' });
      return;
    }

    const messageData: Message = {
      id: Date.now().toString(),
      username: user.username,
      message,
      timestamp: new Date(),
      room,
      status: 'sent',
    };

    // Update room activity
    const roomObj = this.rooms.get(room);
    if (roomObj) {
      roomObj.lastActivity = new Date();
    }

    // Send to all users in room
    this.server.to(room).emit('receive-message', messageData);

    // Send delivery confirmation to sender
    setTimeout(() => {
      client.emit('message-status', {
        messageId: messageData.id,
        status: 'delivered',
      });
    }, 100);

    this.logger.log(`Message from ${user.username} in ${room}: ${message}`);
  }

  @SubscribeMessage('private-message')
  handlePrivateMessage(
    @MessageBody()
    data: {
      to: string;
      message: string;
      targetSocketId: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { to, message, targetSocketId } = data;
    const user = this.connectedUsers.get(client.id);

    if (!user) {
      client.emit('error', { message: 'User not registered' });
      return;
    }

    const messageData: Message = {
      id: Date.now().toString(),
      from: user.username,
      to,
      message,
      timestamp: new Date(),
      isPrivate: true,
      status: 'sent',
      room: '', // Private messages don't belong to a room
    };

    // Send to target user
    client.to(targetSocketId).emit('private-message', messageData);
    // Send back to sender for confirmation
    client.emit('private-message', messageData);

    // Send delivery confirmation
    setTimeout(() => {
      client.emit('message-status', {
        messageId: messageData.id,
        status: 'delivered',
      });
    }, 100);

    this.logger.log(
      `Private message from ${user.username} to ${to}: ${message}`,
    );
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { room: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const { room, isTyping } = data;
    const user = this.connectedUsers.get(client.id);

    if (!user) return;

    if (!this.typingUsers.has(room)) {
      this.typingUsers.set(room, new Set());
    }

    const typingInRoom = this.typingUsers.get(room)!;

    if (isTyping) {
      typingInRoom.add(user.username);
    } else {
      typingInRoom.delete(user.username);
    }

    client.to(room).emit('user-typing', {
      username: user.username,
      isTyping,
      typingUsers: Array.from(typingInRoom),
    });
  }

  @SubscribeMessage('message-read')
  handleMessageRead(
    @MessageBody() data: { messageId: string; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { messageId, room } = data;
    const user = this.connectedUsers.get(client.id);

    if (!user) return;

    this.server.to(room).emit('message-status', {
      messageId,
      status: 'read',
      readBy: user.username,
    });
  }

  @SubscribeMessage('get-online-users')
  handleGetOnlineUsers(@ConnectedSocket() client: Socket) {
    client.emit('users-online', this.getOnlineUsers());
  }

  @SubscribeMessage('get-rooms')
  handleGetRooms(@ConnectedSocket() client: Socket) {
    client.emit('room-list', this.getAvailableRooms());
  }

  // Helper methods
  private emitOnlineUsers() {
    this.server.emit('users-online', this.getOnlineUsers());
  }

  private emitAvailableRooms(client?: Socket) {
    const rooms = this.getAvailableRooms();
    if (client) {
      client.emit('room-list', rooms);
    } else {
      this.server.emit('room-list', rooms);
    }
  }

  private getOnlineUsers() {
    return Array.from(this.connectedUsers.values())
      .filter((user) => user.isOnline)
      .map((user) => ({
        id: user.id,
        username: user.username,
        lastSeen: user.lastSeen,
        currentRoom: user.currentRoom,
      }));
  }

  private getAvailableRooms() {
    return Array.from(this.rooms.values()).map((room) =>
      this.serializeRoom(room),
    );
  }

  private serializeRoom(room: Room) {
    return {
      id: room.id,
      name: room.name,
      userCount: room.users.size,
      createdAt: room.createdAt,
      lastActivity: room.lastActivity,
    };
  }

  private getRoomUsers(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return [];

    return Array.from(room.users)
      .map((socketId) => this.connectedUsers.get(socketId))
      .filter((user) => user)
      .map((user) => ({
        id: user!.id,
        username: user!.username,
        isOnline: user!.isOnline,
        lastSeen: user!.lastSeen,
      }));
  }
}

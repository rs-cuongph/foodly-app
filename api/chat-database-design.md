# Chat Database Design Documentation

## Overview

This document describes the database schema design for the chat functionality in the Foodly application. The design focuses on real-time messaging, room management, and user interactions.

## Database Models

### 1. ChatRoom

Represents a chat room where users can communicate.

```prisma
model ChatRoom {
  id            String      @id @default(uuid())
  name          String      @db.VarChar(255)
  type          ChatRoomType @default(PRIVATE)
  organization_id String
  organization   Organization @relation(fields: [organization_id], references: [id])
  created_by_id  String
  created_by     User        @relation("CreatedBy_ChatRoom", fields: [created_by_id], references: [id])
  created_at     DateTime    @default(now())
  updated_at     DateTime    @updatedAt
  deleted_at     DateTime?
  participants   ChatRoomParticipant[]
  messages       ChatMessage[]
  last_message   ChatMessage? @relation("LastMessage", fields: [last_message_id], references: [id])
  last_message_id String?
}
```

**Fields Description:**

- `id`: Unique identifier for the chat room
- `name`: Name of the chat room
- `type`: Type of chat room (PRIVATE/GROUP)
- `organization_id`: Reference to the organization this chat room belongs to
- `created_by_id`: Reference to the user who created the room
- `created_at`: Timestamp when the room was created
- `updated_at`: Timestamp when the room was last updated
- `deleted_at`: Soft delete timestamp
- `last_message_id`: Reference to the most recent message
- `participants`: Relation to room participants
- `messages`: Relation to room messages

### 2. ChatRoomParticipant

Manages user participation in chat rooms.

```prisma
model ChatRoomParticipant {
  id          String    @id @default(uuid())
  room_id     String
  room        ChatRoom  @relation(fields: [room_id], references: [id], onDelete: Cascade)
  user_id     String
  user        User      @relation(fields: [user_id], references: [id], onDelete: Cascade)
  role        ChatRole  @default(MEMBER)
  joined_at   DateTime  @default(now())
  left_at     DateTime?
  created_at  DateTime  @default(now())
  updated_at  DateTime  @updatedAt
}
```

**Fields Description:**

- `id`: Unique identifier for the participant record
- `room_id`: Reference to the chat room
- `user_id`: Reference to the participating user
- `role`: User's role in the room (ADMIN/MODERATOR/MEMBER)
- `joined_at`: When the user joined the room
- `left_at`: When the user left the room (null if still active)
- `created_at`: Record creation timestamp
- `updated_at`: Record update timestamp

### 3. ChatMessage

Stores chat messages and their metadata.

```prisma
model ChatMessage {
  id            String    @id @default(uuid())
  room_id       String
  room          ChatRoom  @relation(fields: [room_id], references: [id], onDelete: Cascade)
  sender_id     String
  sender        User      @relation("SentMessages", fields: [sender_id], references: [id])
  content       String    @db.Text
  type          MessageType @default(TEXT)
  status        MessageStatus @default(SENT)
  metadata      Json?
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt
  deleted_at    DateTime?
  read_by       ChatMessageRead[]
  last_message_rooms ChatRoom[] @relation("LastMessage")
}
```

**Fields Description:**

- `id`: Unique identifier for the message
- `room_id`: Reference to the chat room
- `sender_id`: Reference to the message sender
- `content`: Message content
- `type`: Type of message (TEXT/IMAGE/FILE/SYSTEM)
- `status`: Message status (SENT/DELIVERED/READ)
- `metadata`: Additional message data (JSON)
- `created_at`: Message creation timestamp
- `updated_at`: Message update timestamp
- `deleted_at`: Soft delete timestamp
- `read_by`: Relation to message read status

### 4. ChatMessageRead

Tracks message read status by users.

```prisma
model ChatMessageRead {
  id          String      @id @default(uuid())
  message_id  String
  message     ChatMessage @relation(fields: [message_id], references: [id], onDelete: Cascade)
  user_id     String
  user        User        @relation("ReadMessages", fields: [user_id], references: [id], onDelete: Cascade)
  read_at     DateTime    @default(now())
}
```

**Fields Description:**

- `id`: Unique identifier for the read record
- `message_id`: Reference to the message
- `user_id`: Reference to the user who read the message
- `read_at`: When the message was read

### 5. UserChatPreference

Stores user-specific chat settings.

```prisma
model UserChatPreference {
  id                String    @id @default(uuid())
  user_id           String    @unique
  user              User      @relation(fields: [user_id], references: [id], onDelete: Cascade)
  notifications     Boolean   @default(true)
  sound_enabled     Boolean   @default(true)
  last_seen         DateTime  @default(now())
  created_at        DateTime  @default(now())
  updated_at        DateTime  @updatedAt
}
```

**Fields Description:**

- `id`: Unique identifier for the preference record
- `user_id`: Reference to the user
- `notifications`: Whether to show notifications
- `sound_enabled`: Whether to play sound notifications
- `last_seen`: Last time the user was active
- `created_at`: Record creation timestamp
- `updated_at`: Record update timestamp

## Enums

### ChatRoomType

```prisma
enum ChatRoomType {
  PRIVATE
  GROUP
}
```

### ChatRole

```prisma
enum ChatRole {
  ADMIN
  MODERATOR
  MEMBER
}
```

### MessageType

```prisma
enum MessageType {
  TEXT
  IMAGE
  FILE
  SYSTEM
}
```

### MessageStatus

```prisma
enum MessageStatus {
  SENT
  DELIVERED
  READ
}
```

## Indexes

- ChatRoom: `organization_id`, `created_by_id`
- ChatRoomParticipant: `user_id`, unique `[room_id, user_id]`
- ChatMessage: `room_id`, `sender_id`
- ChatMessageRead: `user_id`, unique `[message_id, user_id]`

## Relationships

- Organization -> ChatRoom: One-to-Many
- User -> ChatRoom: One-to-Many (created rooms)
- User -> ChatRoomParticipant: One-to-Many
- ChatRoom -> ChatMessage: One-to-Many
- User -> ChatMessage: One-to-Many (sent messages)
- User -> ChatMessageRead: One-to-Many
- User -> UserChatPreference: One-to-One

## Notes

- All models use UUID as primary keys
- Soft delete is implemented where appropriate
- Cascade deletion is used for related records
- Timestamps are automatically managed
- Appropriate indexes are created for performance

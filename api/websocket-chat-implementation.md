# WebSocket Chat Implementation Plan (Backend Only)

## Overview

This document outlines the implementation plan for adding real-time chat functionality using WebSocket to the Foodly API.

## Technical Stack

- WebSocket Server: Socket.IO
- Type Safety: TypeScript
- Database: Prisma (Postgres) path: prisma/schema.prisma

## Implementation Tasks

### 1. Backend Setup

- [x] Install required dependencies

### 2. WebSocket Implementation

- [x] update  ChatGateway event handlers in `src/gateway/chat`
  - [x] Connection management
    - [x] Handle new connections
    - [x] Handle disconnections
    - [x] Handle reconnections
  - [x] Message events
    - [x] Send message
    - [x] Receive message
    - [x] Message status updates
  - [x] Room management
    - [x] Create room
    - [x] Join room
    - [x] Leave room
    - [x] Room updates
  - [x] User presence
    - [x] Online status
    - [x] Typing indicators
    - [x] Last seen updates

### 3. API Endpoints

- [ ] Create REST endpoints in `src/modules/chat`
  - [ ] Message endpoints
    ```typescript
    // GET /api/chat/messages/:roomId
    // GET /api/chat/messages/:roomId/history
    // POST /api/chat/messages
    // PUT /api/chat/messages/:messageId
    // DELETE /api/chat/messages/:messageId
    ```
  - [ ] Room endpoints
    ```typescript
    // GET /api/chat/rooms
    // GET /api/chat/rooms/:roomId
    // POST /api/chat/rooms
    // PUT /api/chat/rooms/:roomId
    // DELETE /api/chat/rooms/:roomId
    ```
  - [ ] User preferences endpoints
    ```typescript
    // GET /api/chat/preferences
    // PUT /api/chat/preferences
    ```

### 4. Security & Performance

- [ ] Implement security measures
  - [ ] Message encryption
  - [ ] Rate limiting
  - [ ] Input sanitization
  - [ ] Authentication checks
- [ ] Optimize performance
  - [ ] Message pagination
  - [ ] Connection optimization
  - [ ] Error handling
  - [ ] Logging

## Dependencies

```json
{
  "dependencies": {
    "socket.io": "^4.7.0",
    "@types/socket.io": "^3.0.2"
  }
}
```

## Notes

- Ensure proper error handling for all WebSocket events
- Implement proper logging for debugging
- Consider implementing message queuing for offline support
- Plan for scalability with multiple chat rooms
- Consider implementing message search functionality
- Plan for handling large file uploads
- Consider implementing message backup/restore functionality

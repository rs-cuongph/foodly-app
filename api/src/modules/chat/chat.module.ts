import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { SharedModule } from '@shared/shared.module';
import { ChatGateway } from '@modules/gateway/chat/chat.gateway';

@Module({
  imports: [SharedModule],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}

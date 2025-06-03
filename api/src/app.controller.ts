import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_NAME_ENUM } from '@enums/job.enum';
import { Public } from '@decorators/auth.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectQueue(QUEUE_NAME_ENUM.APP) private readonly appQueue: Queue,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health/redis')
  async checkRedisHealth() {
    try {
      const client = this.appQueue.client;

      // Add timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Redis connection timeout after 5 seconds'));
        }, 5000);
      });

      // Race between ping and timeout
      await Promise.race([client.ping(), timeoutPromise]);

      return {
        status: 'ok',
        message: 'Redis connection is healthy',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Redis connection failed',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

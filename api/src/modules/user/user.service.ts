import { Inject, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserInterface } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserInterface')
    private readonly UserRepository: UserInterface,
  ) {}
  async findOneByCondition(
    conditions: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    try {
      return await this.UserRepository.findOneByCondition({
        ...conditions,
      });
    } catch (error) {
      throw error;
    }
  }

  async createUser(userDto: Partial<Prisma.UserCreateInput>): Promise<User> {
    try {
      const user = await this.UserRepository.create(userDto);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async setCurrentRefreshToken(id: string, hashedToken: string): Promise<void> {
    try {
      await this.UserRepository.update(id, {
        currentRefreshToken: hashedToken,
      });
    } catch (error) {
      throw error;
    }
  }
}

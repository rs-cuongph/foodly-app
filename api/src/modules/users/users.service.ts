import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "./users.repository";
import { UsersInterface } from "./users.interface";

@Injectable()
export class UsersService {
    constructor(
        @Inject('UsersInterface')
        private readonly usersRepository: UsersInterface,
    ) {

    }
    async findOneByCondition(email: string): Promise<User> {
        try {
            return await this.usersRepository.findOneByCondition({
                email,
            });
        } catch (error) {
            throw error;
        }
    }

    async createUser(userDto: Prisma.UserCreateInput): Promise<User> {
        try {
            const user = await this.usersRepository.create(userDto);
            if (!user) {
                throw new NotFoundException();
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    async setCurrentRefreshToken(
        id: string,
        hashedToken: string,
    ): Promise<void> {
        try {
            await this.usersRepository.update(id, {
                currentRefreshToken: hashedToken,
            });
        } catch (error) {
            throw error;
        }
    }

}
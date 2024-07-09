import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { UserRepository } from "./user.repository";
import { UserInterface } from "./user.interface";

@Injectable()
export class UserService {
    constructor(
        @Inject('UserInterface')
        private readonly UserRepository: UserInterface,
    ) {

    }
    async findOneByCondition(email: string): Promise<User> {
        try {
            return await this.UserRepository.findOneByCondition({
                email,
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

    async setCurrentRefreshToken(
        id: string,
        hashedToken: string,
    ): Promise<void> {
        try {
            await this.UserRepository.update(id, {
                currentRefreshToken: hashedToken,
            });
        } catch (error) {
            throw error;
        }
    }

}
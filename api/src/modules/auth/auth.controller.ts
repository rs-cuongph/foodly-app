import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto, SignUpResponse } from './dto/sign-up.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('sign-up')
  @ApiOperation({
    summary: 'User sign up to platform',
    description: 'User sign up',
    servers: [
      {
        url: 'http://localhost:8080/api/',
        description: 'Current server',
      },
    ],
  })
  @ApiBody({
    type: SignUpDto,
    examples: {
      user_1: {
        value: {
          displayName: 'John Doe',
          email: 'johndoe@example.com',
          password: '1232@asdS',
        } as SignUpDto,
      },
    },
  })
  @ApiOkResponse({
    description: 'Sign up is successful',
    type: SignUpResponse,
    example: {
      accessToken: '',
      refreshToken: '',
    },
  })
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }
}

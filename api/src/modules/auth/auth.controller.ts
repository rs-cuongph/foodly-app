import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto, SignUpResponse } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { RequestWithUser } from 'src/types/requests.type';
import { SignInDto, SignInResponse } from './dto/sign-in.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  @ApiOperation({
    summary: 'User sign up to platform',
    description: 'User sign up',
  })
  @Post('sign-up')
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

  @ApiOperation({
    summary: 'User sign in',
    description: 'User sign in',
  })
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @ApiBody({
    type: SignInDto,
    examples: {
      user_1: {
        value: {
          email: 'johndoe@example.com',
          password: '1232@asdS',
        } as SignInDto,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: SignInResponse,
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Wrong credentials!!',
          error: 'Bad Request',
        },
      },
    },
  })
  async signIn(@Req() request: RequestWithUser) {
    const { user } = request;
    return await this.authService.signIn(user.id.toString());
  }
}

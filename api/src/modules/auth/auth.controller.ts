import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/types/requests.type';
import { SignUpDTO } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { Public } from '@decorators/auth.decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDTO: SignUpDTO) {
    return await this.authService.signUp(signUpDTO);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Req() request: RequestWithUser) {
    const { user } = request;
    return await this.authService.signIn(user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('user-info')
  myInfo(@Req() request: RequestWithUser) {
    const { user } = request;
    return this.authService.getUserInfo(user);
  }
}

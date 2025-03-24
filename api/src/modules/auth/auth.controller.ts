import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/types/requests.type';
import { SignUpDTO } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { Public } from '@decorators/auth.decorator';
import {
  UpdateUserInfoDTO,
  UpdateUserPasswordDTO,
} from './dto/update-user-info.dto';
import { ResetPasswordDTO, SetPasswordDTO } from './dto/reset-password.dto';
import {
  RequestLoginCodeDTO,
  VerifyLoginCodeDTO,
  ResendLoginCodeDTO,
} from './dto/login-by-code.dto';
import { Request } from 'express';

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

  @Public()
  @Post('sign-in-by-code/request')
  async requestLoginCode(@Body() body: RequestLoginCodeDTO) {
    return await this.authService.requestLoginCode(body);
  }

  @Public()
  @Post('sign-in-by-code/resend')
  async resendLoginCode(@Body() body: ResendLoginCodeDTO) {
    return await this.authService.resendLoginCode(body);
  }

  @Public()
  @Post('sign-in-by-code/verify')
  async verifyLoginCode(
    @Body() body: VerifyLoginCodeDTO,
    @Req() request: Request & { clientIp: string },
  ) {
    return await this.authService.verifyLoginCode(body, request);
  }

  @HttpCode(HttpStatus.OK)
  @Get('user-info')
  myInfo(@Req() request: RequestWithUser) {
    const { user } = request;
    return this.authService.getUserInfo(user);
  }

  @Put('user-info')
  updateUserInfo(
    @Body() body: UpdateUserInfoDTO,
    @Req() request: RequestWithUser,
  ) {
    return this.authService.updateUserInfo(body, request.user);
  }

  @Put('change-password')
  updateUserPassword(
    @Body() body: UpdateUserPasswordDTO,
    @Req() request: RequestWithUser,
  ) {
    return this.authService.updateUserPassword(body, request.user);
  }

  @Public()
  @Put('reset-password')
  resetPassword(@Body() body: ResetPasswordDTO) {
    return this.authService.resetPassword(body);
  }

  @Public()
  @Get('verify-reset-password-token')
  verifyResetPasswordToken(@Query('token') token: string) {
    return this.authService.verifyResetPasswordToken(token);
  }

  @Public()
  @Put('set-password')
  setPassword(@Body() body: SetPasswordDTO) {
    return this.authService.setPassword(body);
  }
}

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LocalGuard } from '../guards/local.guard';
import { RegisterDto } from '../dtos/register.dto';
import { IAuthResponse } from '../interfaces/auth-response.interface';
import { AuthService } from '../auth.service';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { JwtAccessGuard } from '../guards/jwt-access.guard';
import { User } from '../../users/decorators/user.decorator';
import { IUser } from '../../users/interfaces/user.interface';

@Controller({ path: 'auth', version: '1' })
export class AuthControllerV1 {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<IAuthResponse> {
    return await this.authService.register(dto);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Req() req) {
    return await this.authService.login(req.user);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh-tokens')
  async refreshTokens(@Req() req) {
    return await this.authService.refreshTokens(req.user.id);
  }

  @UseGuards(JwtAccessGuard)
  @Get('me')
  async profile(@User() user: IUser) {
    return user
  }
}

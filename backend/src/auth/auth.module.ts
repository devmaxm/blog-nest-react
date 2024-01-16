import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthControllerV1 } from './controllers/auth.controller.v1';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UsersModule, ConfigModule, JwtModule],
  providers: [
    AuthService,
    JwtRefreshStrategy,
    JwtAccessStrategy,
    LocalStrategy,
  ],
  controllers: [AuthControllerV1],
})
export class AuthModule {}

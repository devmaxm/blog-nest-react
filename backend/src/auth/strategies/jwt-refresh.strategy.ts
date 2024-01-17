import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const requestRefreshToken = req
      .get('Authorization')
      .replace('Bearer', '')
      .trim();
    /* eslint-disable */
    const { password, refreshToken, ...user } = await this.usersService.getOne({
      /* eslint-enable */
      id: payload.id,
    });
    if (!user || !refreshToken) {
      throw new UnauthorizedException();
    }
    const compareTokens = await bcrypt.compare(
      requestRefreshToken,
      `${refreshToken}`,
    );

    if (!compareTokens) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

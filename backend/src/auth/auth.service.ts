import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersEntity } from '../users/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { ITokens } from './interfaces/tokens.interface';
import { ConfigService } from '@nestjs/config';
import { IAuthResponse } from './interfaces/auth-response.interface';
import { RegisterDto } from './dtos/register.dto';
import { ISanitizedUser } from '../users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getSanitizedUser(user: UsersEntity): ISanitizedUser {
    /* eslint-disable */
    const { password, refreshToken, ...cleanUser } = user;
    /* eslint-enable */
    return cleanUser;
  }

  async refreshTokens(userId: number): Promise<IAuthResponse> {
    const user = await this.usersService.getOne({ id: userId });
    const cleanUser = this.getSanitizedUser(user);
    const tokens = await this.generateTokens(cleanUser);
    await this.updateRefreshToken(cleanUser.id, tokens.refreshToken);

    return {
      user: cleanUser,
      tokens,
    };
  }

  async generateTokens(user: ISanitizedUser): Promise<ITokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(user, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn:
          1000 * 60 * this.configService.get<number>('JWT_ACCESS_EXPIRES'),
      }),
      this.jwtService.signAsync(user, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn:
          1000 *
          60 *
          60 *
          24 *
          this.configService.get<number>('JWT_REFRESH_EXPIRES'),
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedToken = await this.hashPassword(refreshToken);
    await this.usersService.update(
      { id: userId },
      { refreshToken: hashedToken },
    );
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(
      password,
      Number(this.configService.get<number>('BCRYPT_SALT')),
    );
  }

  async validateUser(email: string, password: string): Promise<UsersEntity> {
    const user = await this.usersService.findOne({ email });
    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        return user;
      }
    }
    throw new UnauthorizedException('Incorrect email or password.');
  }

  async login(user: ISanitizedUser): Promise<IAuthResponse> {
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user,
      tokens,
    };
  }

  async register(userData: RegisterDto): Promise<IAuthResponse> {
    const isExistsEmail = await this.usersService.findOne({
      email: userData.email,
    });
    const isExistsUsername = await this.usersService.findOne({
      username: userData.username,
    });
    if (isExistsEmail || isExistsUsername) {
      throw new BadRequestException(
        'User with this email or username already exists.',
      );
    }
    const data = {
      ...userData,
      password: await this.hashPassword(userData.password),
    };
    const user = await this.usersService.create(data);
    return await this.refreshTokens(user.id);
  }

  async getProfile(userId: number): Promise<ISanitizedUser> {
    const user = await this.usersService.getOne({ id: userId });
    return this.getSanitizedUser(user);
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersEntity } from '../users/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { ITokens } from './interfaces/tokens.interface';
import { ConfigService } from '@nestjs/config';
import { IAuthResponse } from './interfaces/auth-response.interface';
import { RegisterDto } from './dtos/register.dto';
import { IUser } from '../users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getCleanUser(user: UsersEntity): IUser {
    /* eslint-disable */
    const { password, refreshToken, ...cleanUser } = user;
    /* eslint-enable */
    return cleanUser;
  }

  async refreshTokens(userId: number): Promise<IAuthResponse> {
    const user = await this.usersService.getOne({ id: userId });
    const cleanUser = this.getCleanUser(user);
    const tokens = await this.generateTokens(cleanUser);
    await this.updateRefreshToken(cleanUser.id, tokens.refreshToken);

    return {
      user: cleanUser,
      tokens,
    };
  }

  async generateTokens(user: IUser): Promise<ITokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(user, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(user, {
        secret: '3uoifhaslkdfsgfgdasiopgu2j3igfja',
        expiresIn: '7d',
      }),
    ]);
    console.log(user)
    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedToken = await this.hashData(refreshToken);
    await this.usersService.update(
      { id: userId },
      { refreshToken: hashedToken },
    );
  }

  async hashData(data: string): Promise<string> {
    return await bcrypt.hash(
      data,
      Number(this.configService.get<number>('BCRYPT_SALT')),
    );
  }

  async validateUser(email: string, password: string): Promise<UsersEntity> {
    const user = await this.usersService.getOne({ email });
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        return user;
      }
    }
    throw new HttpException(
      'Incorrect email or password.',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async login(user: IUser): Promise<IAuthResponse> {
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user,
      tokens,
    };
  }

  async register(dto: RegisterDto): Promise<IAuthResponse> {
    const isExists = await this.usersService.getOne({ email: dto.email });
    if (isExists) {
      throw new HttpException(
        `User with email ${dto.email} is already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const data = {
      ...dto,
      password: await this.hashData(dto.password),
    };
    const user = await this.usersService.create(data);
    return await this.refreshTokens(user.id);
  }
}

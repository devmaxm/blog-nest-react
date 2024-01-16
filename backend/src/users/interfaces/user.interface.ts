import { OmitType } from '@nestjs/swagger';
import { UsersEntity } from '../entities/users.entity';

export class IUser extends OmitType(UsersEntity, [
  'password',
  'refreshToken',
]) {}

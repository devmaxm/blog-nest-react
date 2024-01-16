import { OmitType } from '@nestjs/swagger';
import { UsersEntity } from '../entities/users.entity';
import { IPaginatedResponse } from './../../data-types/interfaces/paginated-response.interface';

export class ISanitizedUser extends OmitType(UsersEntity, [
  'password',
  'refreshToken',
]) {}

export class IPaginatedUsers extends IPaginatedResponse<ISanitizedUser> {}

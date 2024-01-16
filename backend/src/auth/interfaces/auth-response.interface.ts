import { IUser } from '../../users/interfaces/user.interface';
import { ITokens } from './tokens.interface';

export class IAuthResponse {
  user: IUser;
  tokens: ITokens;
}

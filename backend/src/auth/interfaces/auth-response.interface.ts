import { ISanitizedUser } from '../../users/interfaces/user.interface';
import { ITokens } from './tokens.interface';

export class IAuthResponse {
  user: ISanitizedUser;
  tokens: ITokens;
}

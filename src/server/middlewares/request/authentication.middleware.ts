import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { UserRepository } from '../../../database/models/user/user.repository';
import { CryptoService } from '../../../app/crypto.service';
import { AuthAccount } from '../../../interfaces/AuthAccount.interface';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async use(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) {
      req.account = this._publicAccount();
      return next();
    }
    const jwtPayload = await this.cryptoService.verifyJwtToken(authorization);
    if (jwtPayload) {
      const { sub } = jwtPayload;
      req.account = await this._findAndValidateAccount(sub);
      return next();
    }
    throw new ForbiddenException('Invalid Account');
  }

  _publicAccount(): AuthAccount {
    return {
      _id: null,
      role: 'public',
    } as AuthAccount;
  }

  async _findAndValidateAccount(id: string): Promise<AuthAccount> {
    try {
      const user = await this.userRepository.getById(id, {});
      return {
        _id: user._id.toString(),
        role: user.role,
        status: user.status,
      } as AuthAccount;
    } catch (err) {
      throw new ForbiddenException('Invalid Account');
    }
  }
}

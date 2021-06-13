import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigurationService } from '../config/configuration.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CryptoService {
  constructor(private readonly configurationService: ConfigurationService) {}

  SALT_ROUNDS = 10;

  createHash(text): string {
    return bcrypt.hashSync(text, bcrypt.genSaltSync(this.SALT_ROUNDS));
  }

  createHmac(crc_token, consumer_secret) {
    return crypto
      .createHmac('sha256', consumer_secret)
      .update(crc_token)
      .digest('base64');
  }

  async compareHash(text, hash): Promise<boolean> {
    return bcrypt.compare(text, hash);
  }

  async createJwtToken(data): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        data,
        this.configurationService.authenticationKey,
        (err, token) => {
          if (err) {
            return reject(err);
          }
          return resolve(token);
        },
      );
    });
  }

  async verifyJwtToken(token): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        this.configurationService.authenticationKey,
        (err, decoded) => {
          if (!err) {
            return resolve(decoded);
          }
          const error = new ForbiddenException('Invalid authorization token');
          return reject(error);
        },
      );
    });
  }
}

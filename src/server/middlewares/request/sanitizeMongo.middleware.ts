import * as _ from 'lodash';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class SanitizeMongoMiddleware implements NestMiddleware {
  use(req, res, next) {
    const body = _.get(req, 'body');
    this.sanitizeMongoData(body);
    next();
  }

  sanitizeMongoData(body) {
    if (body instanceof Object) {
      Object.keys(body).forEach((key) => {
        if (/^\$/.test(key)) {
          _.unset(body, key);
        } else {
          this.sanitizeMongoData(body[key]);
        }
      });
    }
  }
}

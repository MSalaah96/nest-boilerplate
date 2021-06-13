import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessControl } from 'accesscontrol';
import { Resources } from '../../decorators/resource.decorator';
import { AccessTypes } from '../../decorators/access.decorator';
import { Authorization } from './Authorization';
import * as _ from 'lodash';

@Injectable()
export class AuthGuard implements CanActivate {
  acl;
  accessType = [
    'createOwn',
    'createAny',
    'readOwn',
    'readAny',
    'updateOwn',
    'updateAny',
    'deleteOwn',
    'deleteAny',
  ];

  constructor(private reflector: Reflector) {
    this.acl = new AccessControl(Authorization);
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const account = request.account;
    const params = request.params;
    const resource = this.reflector.get<Resources>(
      'resource',
      context.getClass(),
    );
    const access = this.reflector.get<AccessTypes[]>(
      'access',
      context.getHandler(),
    );
    let predicate = this.reflector.get<any>('predicate', context.getHandler());
    if (predicate) {
      predicate = predicate.bind(null, account, params);
    }
    const permission = await this.authorize(
      account,
      resource,
      access,
      predicate,
    );
    return true;
  }

  async _getAccess(
    role: string,
    resource: Resources,
    access: Array<AccessTypes>,
    predicate,
  ) {
    let permission;
    let allowed = false;
    let accountAccess;
    const nAccess = access.map((value) => this.accessType[value]);
    if (
      !nAccess ||
      _.intersection(nAccess, this.accessType).length !== nAccess.length
    ) {
      throw new BadRequestException(
        {},
        'Missing or invalid authorization access type',
      );
    }

    for (let i = 0; i < nAccess.length; i += 1) {
      permission = this.acl.can(role)[nAccess[i]](resource.toString());
      if (permission.granted) {
        accountAccess = nAccess[i];
        if (!_.isNil(predicate)) {
          if (accountAccess.toLowerCase().endsWith('own')) {
            // eslint-disable-next-line no-await-in-loop
            const result = await predicate();

            if (result) {
              allowed = true;
              break;
            }

            break;
          }
        }

        allowed = true;
        break;
      }
    }

    return {
      permission,
      allowed,
    };
  }

  async authorize(
    account,
    resource: Resources,
    access: Array<AccessTypes>,
    predicate,
  ) {
    if (_.isNil(account)) {
      throw new ForbiddenException();
    }

    const { role } = account;
    const { permission, allowed } = await this._getAccess(
      role,
      resource,
      access,
      predicate,
    );
    if (permission.granted === true && allowed === true) {
      return permission;
    }

    throw new UnauthorizedException();
  }

  async filterByPermission(permission, object, path) {
    if (permission && permission.granted) {
      if (path) {
        _.set(object, path, permission.filter(_.get(object, path)));
      }
    }
  }
}

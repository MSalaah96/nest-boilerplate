import { Injectable } from '@nestjs/common';

@Injectable()
export class ConstantService {
  private readonly Roles = { admin: 'admin', user: 'user' };
  private readonly AccountStatuses = { active: 'active', blocked: 'blocked' };

  get ROLES(): { admin: string; user: string } {
    return this.Roles;
  }

  get ROLES_ENUM(): Array<string> {
    return Object.values(this.Roles);
  }

  get ACCOUNT_STATUSES(): { active: string; blocked: string } {
    return this.AccountStatuses;
  }

  get ACCOUNT_STATUSES_ENUM(): Array<string> {
    return Object.values(this.AccountStatuses);
  }
}

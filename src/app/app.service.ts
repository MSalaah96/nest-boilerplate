import { Injectable } from '@nestjs/common';
import { UserRepository } from '../database/models/user/user.repository';

@Injectable()
export class AppService {
  constructor() {}

  getHello() {
    // return this.userRepository.getAll(
    //   {},
    //   { page: 0, limit: 10, sort: {} },
    //   false,
    // );
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export default class UserService {
  async createUser() {
    return 'createUser';
  }
};


import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export default class UserService {
  async createUser(createUserDto: CreateUserDto) {
    return createUserDto;
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { JWT_SECRET } from '@app/config';
import { IUserResponse } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private generateJwt(user: UserEntity): string {
    console.log('user', user);
    return sign(
      {
        id: user.id,
        username: user.email,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): IUserResponse {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    const userByUsername = await this.userRepository.findOne({
      username: createUserDto.username,
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return this.userRepository.save(newUser);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne(
      {
        email: loginUserDto.email,
      },
      {
        select: ['id', 'username', 'email', 'bio', 'image', 'password'],
      },
    );
    const validPassword = await compare(loginUserDto.password, user?.password);

    if (!user || !validPassword) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNAUTHORIZED,
      );
    }

    delete user.password;
    return user;
  }

  finById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.finById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    return user;
  }
}

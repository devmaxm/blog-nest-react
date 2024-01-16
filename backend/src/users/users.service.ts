import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersEntity } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { IUserFindOptions } from './interfaces/user-find-options.interface';
import { FindUsersDto } from './dtos/find-users.dto';
import { IPaginatedUsers } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async create(data: CreateUserDto): Promise<UsersEntity> {
    const user = this.usersRepository.create({
      email: data.email,
      username: data.username,
      password: data.password,
    });
    return await this.usersRepository.save(user);
  }

  async getOneSanitized(where: IUserFindOptions): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({ where });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async findOneSanitized(where: IUserFindOptions): Promise<UsersEntity> {
    return await this.usersRepository.findOne({ where });
  }

  async findOne(where: IUserFindOptions): Promise<UsersEntity | null> {
    return await this.usersRepository.findOne({
      where,
      select: [
        'id',
        'username',
        'email',
        'password',
        'refreshToken',
        'createdAt',
      ],
    });
  }

  async getOne(where: IUserFindOptions): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where,
      select: [
        'id',
        'username',
        'email',
        'password',
        'refreshToken',
        'createdAt',
      ],
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async getAllPaginated(findParams: FindUsersDto): Promise<IPaginatedUsers> {
    const page = Number(findParams.page) || 1;
    const limit = Number(findParams.limit) || 10;
    const offset = (page - 1) * limit;

    const [data, total] = await this.usersRepository.findAndCount({
      take: limit,
      skip: offset,
    });
    return {
      data,
      total,
      page,
      perPage: data.length,
    };
  }

  async update(
    where: IUserFindOptions,
    data: UpdateUserDto,
  ): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({ where });
    Object.assign(user, data);
    return await this.usersRepository.save(user);
  }
}

import { Injectable } from '@nestjs/common';
import { UsersEntity } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async create(data: CreateUserDto): Promise<UsersEntity> {
    const user = new UsersEntity();
    Object.assign(user, data);
    return await this.usersRepository.save(user);
  }

  async getOneClean(
    where: FindOptionsWhere<UsersEntity>,
  ): Promise<UsersEntity | null> {
    return await this.usersRepository.findOne({ where });
  }

  async getOne(
    where: FindOptionsWhere<UsersEntity>,
  ): Promise<UsersEntity | null> {
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

  async getAll(): Promise<UsersEntity[]> {
    return await this.usersRepository.find();
  }

  async update(
    where: FindOptionsWhere<UsersEntity>,
    data: UpdateUserDto,
  ): Promise<UsersEntity> {
    const user = await this.usersRepository.findOneBy(where);
    Object.assign(user, data);
    return await this.usersRepository.save(user);
  }

  async delete() {}
}

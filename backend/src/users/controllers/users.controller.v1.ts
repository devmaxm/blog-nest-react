import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UsersService } from '../users.service';
import { ISanitizedUser } from '../interfaces/user.interface';
import { UpdateUserBodyDto } from '../dtos/update-user.dto';
import { UsersEntity } from '../entities/users.entity';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';

@Controller({ path: 'users', version: '1' })
export class UsersControllerV1 {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId')
  async getOne(@Param('userId') userId: string): Promise<ISanitizedUser> {
    return await this.usersService.getOneSanitized({ id: Number(userId) });
  }

  @UseGuards(JwtAccessGuard)
  @Put(':userId')
  async update(
    @Param('userId') userId: string,
    @Body() data: UpdateUserBodyDto,
  ): Promise<UsersEntity> {
    const user = await this.usersService.getOne({ id: Number(userId) });
    return await this.usersService.update({ id: user.id }, data);
  }
}

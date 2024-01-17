import { Controller, Get, UseGuards } from '@nestjs/common';
import { NotificationsService } from '../notifications.service';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { User } from '../../users/decorators/user.decorator';
import { ISanitizedUser } from '../../users/interfaces/user.interface';
import { NotificationsEntity } from '../entities/notification.entity';

@Controller({ path: 'notifications', version: '1' })
export class NotificationsControllerV1 {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAccessGuard)
  @Get()
  async getAll(
    @User() currentUser: ISanitizedUser,
  ): Promise<NotificationsEntity[]> {
    return await this.notificationsService.getAll(currentUser.id);
  }
}

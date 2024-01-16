import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersControllerV1 } from './controllers/users.controller.v1';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  providers: [UsersService],
  controllers: [UsersControllerV1],
  exports: [UsersService],
})
export class UsersModule {}

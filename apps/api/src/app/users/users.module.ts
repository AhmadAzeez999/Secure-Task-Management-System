import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';

@Module(
{
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService],
    exports: [UsersService], // So AuthService can inject it
    controllers: [UsersController]
})

export class UsersModule {}

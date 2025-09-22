import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../auth/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // protects all routes with JWT and role-based access
export class UsersController
{
    constructor(private readonly usersService: UsersService) {}
    
    @Roles('admin', 'owner')
    @Get('getAllUsers')
    async getAllUsers(): Promise<User[]>
    {
        return this.usersService.findAll();
    }
}

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '@task-management-system/data';
import { LoginDTO } from '@task-management-system/data';

@Controller('auth')
export class AuthController
{
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signup(@Body() createUserDTO: CreateUserDTO)
    {
        const { username, password, role } = createUserDTO;
        return this.authService.signup(username, password, role);
    }

    @Post('login')
    async login(@Body() loginDTO: LoginDTO)
    {
        const { username, password } = loginDTO;

        // For validating user credentials
        const user = await this.authService.validateUser(username, password);

        // For generating and returning JWT
        return this.authService.login(user);
    }
}

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate
{
    // Using Reflector to read metadata attached by decorators (@Roles in this case)
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean
    {
        // To get the roles required for this route (from @Roles decorator)
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // console.log("Required roles: " + requiredRoles);

        if (!requiredRoles)
            return true;

        // To get the logged-in user from the request (populated by JwtAuthGuard)
        const { user } = context.switchToHttp().getRequest();
        
        // console.log("User's role: " + user.role);
        
        // Check if the user's role is in the list of allowed roles
        // If yes, allow access, if no, block access
        return requiredRoles.includes(user.role);
    }
}

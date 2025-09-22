import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// Decorator to attach roles metadata to a route
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

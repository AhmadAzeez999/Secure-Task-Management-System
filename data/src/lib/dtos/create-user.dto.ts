export class CreateUserDTO
{
    readonly username!: string;
    readonly password!: string;
    readonly role!: 'owner' | 'admin' | 'user';
}
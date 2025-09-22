import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService
{
    constructor(
        @InjectRepository(User) private usersRepo: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async signup(username: string, password: string, role: string): Promise<User>
    {
        const hashed = await bcrypt.hash(password, 10);
        const user = this.usersRepo.create({ username, password: hashed, role });
        return this.usersRepo.save(user);
    }

    async findByUsername(username: string): Promise<User>
    {
        return this.usersRepo.findOne({ where: { username } });
    }

    async validateUser(username: string, password: string): Promise<User>
    {
        const user = await this.findByUsername(username);

        if (!user)
            throw new UnauthorizedException('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch)
            throw new UnauthorizedException('Invalid credentials');

        return user;
    }

    async login(user: User)
    {
        const payload = { username: user.username, sub: user.id, role: user.role };
        
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async findAll(): Promise<User[]>
    {
        return this.usersRepo.find();
    }
}

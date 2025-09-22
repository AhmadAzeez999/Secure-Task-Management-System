import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';

@Injectable()
export class UsersService
{
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]>
    {
        return this.userRepository.find();
    }

    // For finding a user by username
    async findByUsername(username: string): Promise<User | undefined>
    {
        return this.userRepository.findOneBy({ username });
    }

    // For finding a user by ID
    async findById(id: number): Promise<User | undefined>
    {
        return this.userRepository.findOneBy({ id });
    }
}

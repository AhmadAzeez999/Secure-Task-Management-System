import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService
{
    constructor(
        @InjectRepository(Task) private tasksRepo: Repository<Task>,
        @InjectRepository(User) private usersRepo: Repository<User>,
    ) {}

    async create(
        taskData: { title: string; description: string; status: string; creator: string; assignee: string },
        userId: number
    ): Promise<Task>
    {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user)
        {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const task = this.tasksRepo.create({ ...taskData, owner: user });
        return this.tasksRepo.save(task);
    }

    async findAll()
    {
        return this.tasksRepo.find(
        {
            relations: ['owner'],
        });
    }

    async findAllByOwner(assigneeUsername: string)
    {
        console.log(assigneeUsername);
        
        return this.tasksRepo.find(
        {
            where: { assignee: assigneeUsername },
            relations: ['owner'],
        });
    }

    async findOne(id: number): Promise<Task>
    {
        const task = await this.tasksRepo.findOne({
            where: { id },
            relations: ['owner'],
        });

        if (!task)
        {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        return task;
    }

    async update(
        id: number,
        updateData: Partial<{ title: string; description: string; status: string }>
    ): Promise<Task>
    {
        const task = await this.findOne(id);
        Object.assign(task, updateData);
        return this.tasksRepo.save(task);
    }

    async remove(id: number): Promise<void>
    {
        const result = await this.tasksRepo.delete(id);
        if (result.affected === 0)
        {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }
}
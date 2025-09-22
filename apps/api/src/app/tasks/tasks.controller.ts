import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard) // protects all routes with JWT and role-based access
export class TasksController
{
    constructor(private readonly tasksService: TasksService) {}

    @Roles('admin', 'owner') // Only admins and owners are allowed to create tasks
    @Post()
    async create(@Body() task: Omit<Task, 'id' | 'owner'>, @Request() req)
    {
        // req.user comes from JWT strategy and contains userId
        return this.tasksService.create(
            {
                title: task.title,
                description: task.description,
                status: task.status,
                creator: task.creator,
                assignee: task.assignee,
            },
            req.user.userId, // pass userId to associate task with owner
        );
    }

    @Get()
    async findAll(@Request() req)
    {
        const user = req.user;
        // console.log(user);

        if (user.role === 'admin' || user.role === 'owner')
        {
            // Admins and Owners can see all tasks
            return this.tasksService.findAll();
        }
        else
        {
            // Regular users only see their own tasks
            return this.tasksService.findAllByOwner(user.username);
        }
    }
    
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updates: Partial<Omit<Task, 'id' | 'owner'>>,
        @Request() req
    )
    {
        return this.tasksService.update(+id, updates);
    }

    @Roles('owner') // Only owners are allowed to delete tasks
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req)
    {
        try
        {
            await this.tasksService.remove(+id);
            return { message: 'Task deleted successfully' };
        }
        catch (err)
        {
            throw new NotFoundException(err.message);
        }
    }
}
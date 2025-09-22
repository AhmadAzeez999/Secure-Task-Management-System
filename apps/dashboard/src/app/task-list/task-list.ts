import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../services/task.service';
import { TaskItem } from '../task-item/task-item';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Task } from '@task-management-system/data';
import { User } from '@task-management-system/data';
import { UsersService } from '../services/users.service';
import { Subscription } from 'rxjs';
import { ThemeService } from '../services/theme.service';

@Component(
{
    selector: 'app-task-list',
    templateUrl: './task-list.html',
    standalone: true,
    imports: [CommonModule, DragDropModule, TaskItem, FormsModule],
})

export class TaskList implements OnInit
{
    todo: Task[] = [];
    inProgress: Task[] = [];
    done: Task[] = [];

    allUsers: User[] = [];

    showAddModal = false;
    showAddBtn = false;
    newTask: { title: string; description: string; creator: string, assignee: string } =
    {
        title: '',
        description: '',
        creator: '',
        assignee: '',
    };

        isDarkMode: boolean = true;
        private themeSubscription?: Subscription;

    constructor(private taskService: TaskService, private authService: AuthService,
        private usersService: UsersService, private themeService: ThemeService) {}

    ngOnInit(): void
    {
        this.loadTasks();
        this.loadUser();
        this.loadAllUsers();

        this.themeSubscription = this.themeService.isDarkMode$.subscribe(
            isDarkMode => this.isDarkMode = isDarkMode
        );
    }

    ngOnDestroy()
    {
        if (this.themeSubscription)
        {
            this.themeSubscription.unsubscribe();
        }
    }

    loadUser(): void
    {
        const user = this.authService.getUser();

        if (user)
        {
            this.showAddBtn = user.role === 'admin' || user.role === 'owner';
        }
    }
    
    loadAllUsers(): void
    {
        const user = this.authService.getUser();
        
        if (user?.role === 'user')
            return;

        this.usersService.getAllUsers().subscribe(users =>
        {
            this.allUsers = users;
            console.log(this.allUsers);
        });
    }

    loadTasks(): void
    {
        this.taskService.getTasks().subscribe(
        {
            next: (tasks: Task[]) =>
            {
                this.todo = tasks.filter(t => t.status === 'todo');
                this.inProgress = tasks.filter(t => t.status === 'in-progress');
                this.done = tasks.filter(t => t.status === 'done');
            },
            error: (err) => console.error('Failed to fetch tasks:', err),
        });
    }

    drop(event: CdkDragDrop<Task[]>): void
    {
        if (event.previousContainer === event.container)
        {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        }
        else
        {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
        }

        // FOr finding out which list we dropped into
        const containerId = event.container.element.nativeElement.id;
        let newStatus: 'todo' | 'in-progress' | 'done' = 'todo';

        if (containerId === 'inProgressList')
            newStatus = 'in-progress';
        else if (containerId === 'doneList')
            newStatus = 'done';
        else if (containerId === 'todoList')
            newStatus = 'todo';

        // Update the moved task’s status
        const movedTask = event.container.data[event.currentIndex];

        if (movedTask.status !== newStatus)
        {
            movedTask.status = newStatus;

            this.taskService.updateTask(movedTask.id, { status: newStatus }).subscribe({
                error: (err) => console.error('Failed to update task status:', err),
            });
        }
    }

    openAddModal(): void
    {
        this.newTask = { title: '', description: '', creator: '', assignee: '' };
        this.showAddModal = true;
    }

    closeAddModal(): void
    {
        this.showAddModal = false;
    }

    saveTask(): void
    {
        if (!this.newTask.title.trim())
            return;

        const user = this.authService.getUser();
        this.newTask.creator = user!.username;

        const task: Omit<Task, 'id'> =
        {
            title: this.newTask.title,
            description: this.newTask.description,
            status: 'todo',
            creator: this.newTask.creator,
            assignee: this.newTask.assignee
        };

        this.taskService.createTask(task).subscribe(
        {
            next: (createdTask) =>
            {
                this.todo.push(createdTask);
                this.closeAddModal();
            },
            error: (err) => console.error('Failed to create task:', err),
        });
    }

    get totalTasks(): number
    {
        return this.todo.length + this.inProgress.length + this.done.length;
    }

    get progressPercentage(): number
    {
        return this.totalTasks > 0
            ? Math.round((this.done.length / this.totalTasks) * 100)
            : 0;
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent)
    {
        const user = this.authService.getUser();

        if (user?.role !== 'user' && event.ctrlKey && event.key === 'm')
        {
            event.preventDefault();
            this.openAddModal();
        }
    }
}

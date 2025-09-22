import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task.service';
import { CdkDragHandle } from '@angular/cdk/drag-drop';
import { Task } from '@task-management-system/data';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component(
{
    selector: 'app-task-item',
    standalone: true,
    imports: [CommonModule, CdkDragHandle],
    templateUrl: './task-item.html',
})
export class TaskItem
{
    @Input() task!: Task;

    isOwner = false;

    showModal = false;

    isDarkMode: boolean = true;
    private themeSubscription?: Subscription;

    constructor(private taskService: TaskService, private themeService: ThemeService, private authService: AuthService) {}

    ngOnInit(): void
    {
        this.themeSubscription = this.themeService.isDarkMode$.subscribe(
            isDarkMode => this.isDarkMode = isDarkMode
        );
        
        this.isOwner = this.authService.getUser()?.role === 'owner';
    }

    ngOnDestroy()
    {
        if (this.themeSubscription)
        {
            this.themeSubscription.unsubscribe();
        }
    }

    deleteTask()
    {
        this.taskService.deleteTask(this.task.id)
            .subscribe(() =>
            {
                alert('Task deleted!');
                window.location.reload();
            });
    }

    openModal()
    {
        this.showModal = true;
    }

    closeModal()
    {
        this.showModal = false;
    }
}

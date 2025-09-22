import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '@task-management-system/data';

@Injectable({ providedIn: 'root' })
export class TaskService
{
    private baseUrl = 'http://localhost:3000/api/tasks';

    constructor(private http: HttpClient) {}

    private getHeaders()
    {
        const token = localStorage.getItem('jwt') || '';
        return { Authorization: `Bearer ${token}` };
    }

    // Fetch all tasks
    getTasks(): Observable<Task[]>
    {
        return this.http.get<Task[]>(this.baseUrl, { headers: this.getHeaders() });
    }

    createTask(task: Omit<Task, 'id'>): Observable<Task>
    {
        return this.http.post<Task>(this.baseUrl, task, { headers: this.getHeaders() });
    }

    updateTask(id: number, task: Partial<Task>): Observable<Task>
    {
        return this.http.put<Task>(`${this.baseUrl}/${id}`, task, { headers: this.getHeaders() });
    }

    deleteTask(id: number): Observable<{ message: string }>
    {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
    }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '@task-management-system/data'; // adjust path if needed

@Injectable({
  providedIn: 'root'
})
export class UsersService
{
    private baseUrl = 'http://localhost:3000/api/users/getAllUsers';

    constructor(private http: HttpClient) {}

    // Fetch all users
    getAllUsers(): Observable<User[]>
    {
        return this.http.get<User[]>(this.baseUrl, {
            headers:
            {
                Authorization: `Bearer ${localStorage.getItem('jwt') || ''}`
            }
        });
    }
}

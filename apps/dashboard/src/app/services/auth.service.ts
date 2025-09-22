import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { User } from '@task-management-system/data';

interface JwtPayload
{
    sub: number; // This is the user id (saved in the backend)
    username: string;
    role: 'user' | 'admin' | 'owner';
    exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService
{
    private baseUrl = 'http://localhost:3000/api/auth';
    private currentUser: User | null = null;

    constructor(private http: HttpClient) {}

    signup(data: { username: string; password: string; role: string })
    {
        return this.http.post(`${this.baseUrl}/signup`, data);
    }

    login(data: { username: string; password: string })
    {
        return this.http
        .post<{ access_token: string }>(`${this.baseUrl}/login`, data)
        .pipe(
            tap(res =>
            {
                localStorage.setItem('jwt', res.access_token);
                this.setUserFromToken(res.access_token);
            })
        );
    }

    logout()
    {
        localStorage.removeItem('jwt');
        this.currentUser = null;
    }

    getToken()
    {
        return localStorage.getItem('jwt');
    }

    // Decoding and setting user
    private setUserFromToken(token: string)
    {
        const payload = jwtDecode<JwtPayload>(token);
        this.currentUser =
        {
            id: payload.sub,
            username: payload.username,
            role: payload.role,
        };
    }

    getUser(): User | null
    {
        if (!this.currentUser)
        {
            const token = this.getToken();

            if (token)
                this.setUserFromToken(token);
        }

        return this.currentUser;
    }

    isLoggedIn(): boolean
    {
        console.log(localStorage.getItem('jwt'));
        return !!localStorage.getItem('jwt');
    }
}
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { ThemeService } from './services/theme.service';

@Component(
{
    selector: 'app-root',
    standalone: false,
    templateUrl: './app.html',
    styleUrl: './app.css',
})

export class App
{
    protected title = 'dashboard';
    username: string = '';
    currentYear = new Date().getFullYear();

    isDarkMode: boolean = true;
    private themeSubscription?: Subscription;

    constructor(private router: Router, private authService: AuthService, private themeService: ThemeService) {}

    ngOnInit(): void
    {
        if (!this.isLoggedIn())
        {
            this.router.navigate(['/login']);
        }

        // Subscribe to theme changes
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

    toggleTheme()
    {
        this.themeService.toggleTheme();
    }

    isLoggedIn(): boolean
    {
        const user = this.authService.getUser();
        
        if (user)
            this.username = user!.username;

        return !!localStorage.getItem('jwt');
    }

    logout(): void
    {
        localStorage.removeItem('jwt');
        this.router.navigate(['/login']);

    }

    goToLogin(): void
    {
        this.router.navigate(['/login']);
    }

    goToSignup(): void
    {
        this.router.navigate(['/signup']);
    }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    standalone: true,
    imports: [FormsModule],
})
export class Login implements OnInit
{
    username = '';
    password = '';
    errorMessage = '';

    isDarkMode: boolean = true;
    private themeSubscription?: Subscription;

    constructor(private auth: AuthService, private router: Router, private themeService: ThemeService) {}

    ngOnInit(): void
    {
        if (this.auth.isLoggedIn()) 
        {
            this.router.navigate(['/tasks']);
        }

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

    onSubmit()
    {
        this.auth.login({ username: this.username, password: this.password }).subscribe(
        {
            next: () => this.router.navigate(['/tasks']),
            error: (err) => this.errorMessage = err.error?.message || 'Login failed',
        });
    }
}

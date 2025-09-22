import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms'; 
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';

@Component(
{
    selector: 'app-signup',
    templateUrl: './signup.html',
    standalone: true,
    imports: [FormsModule],
})

export class Signup
{
    username = '';
    password = '';
    role = 'user';

    isDarkMode: boolean = true;
    private themeSubscription?: Subscription;

    constructor(private auth: AuthService, private router: Router, private themeService: ThemeService) {}

    ngOnInit(): void
    {
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
        this.auth.signup({ username: this.username, password: this.password, role: this.role }).subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => alert(err.error.message || 'Signup failed'),
        });
    }
}

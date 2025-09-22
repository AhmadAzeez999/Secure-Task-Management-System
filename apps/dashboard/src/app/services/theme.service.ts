import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable(
{
    providedIn: 'root'
})

export class ThemeService
{
    private isDarkModeSubject = new BehaviorSubject<boolean>(true);
    public isDarkMode$: Observable<boolean> = this.isDarkModeSubject.asObservable();

    constructor()
    {
        // Initialize theme from localStorage or system preference
        this.initializeTheme();
    }

    private initializeTheme()
    {
        const savedTheme = localStorage.getItem('theme');
        let isDarkMode: boolean;

        if (savedTheme)
        {
        isDarkMode = savedTheme === 'dark';
        }
        else
        {
        // Default to dark mode or system preference
        isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        this.setTheme(isDarkMode);
    }

    public toggleTheme()
    {
        const currentTheme = this.isDarkModeSubject.value;
        this.setTheme(!currentTheme);
    }

    public setTheme(isDarkMode: boolean)
    {
        this.isDarkModeSubject.next(isDarkMode);
        
        // Applying theme to document root
        if (isDarkMode)
        {
        document.documentElement.classList.add('dark');
        }
        else
        {
        document.documentElement.classList.remove('dark');
        }

        // Saving preferences to localStorage
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }

    public get isDarkMode(): boolean
    {
        return this.isDarkModeSubject.value;
    }
}
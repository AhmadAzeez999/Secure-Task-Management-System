import { Route } from '@angular/router';
import { Login } from '../app/login/login';
import { Signup } from './signup/signup';
import { TaskList } from './task-list/task-list';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'tasks', component: TaskList },
  { path: '**', redirectTo: 'tasks' },
];


import { importProvidersFrom, NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { App } from './app';
import { appRoutes } from './app.routes';
import { NxWelcome } from './nx-welcome';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { TaskList } from './task-list/task-list';
import { provideHttpClient } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [App, NxWelcome],
  imports: [BrowserModule, RouterModule.forRoot(appRoutes), Login, Signup, TaskList],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    importProvidersFrom(DragDropModule)
  ],
  bootstrap: [App],
})
export class AppModule {}

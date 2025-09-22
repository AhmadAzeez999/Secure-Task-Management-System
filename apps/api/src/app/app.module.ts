import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TasksModule } from './tasks/tasks.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/user.entity';
import { Task } from './tasks/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities:[User, Task],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

# Secure Task Management System

Designed and implemented a secure Task Management System using role-based access control (RBAC) in a modular NX monorepo. The system allows users to manage tasks securely, ensuring only authorized users can access and modify data based on their roles.

---

## Setup Instructions

### **1. Clone the Repository**

```bash
git clone https://github.com/yourusername/TaskManagementSystem.git
cd TaskManagementSystem
```

### **2. Install Dependencies**

```bash
pnpm install
```

> NX monorepo uses `pnpm` for fast and efficient package management.

### **3. Configure Environment Variables**

Create a `.env` file in the root of the backend app (apps/api/):

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=task_management
JWT_SECRET=secret
```

### **4. Run the Apps**

**Backend**

```bash
nx serve backend
```

**Frontend**

```bash
nx serve frontend
```

> Both apps are served locally; backend on `http://localhost:3000`, frontend on `http://localhost:4200`.

---

## Architecture Overview

### **NX Monorepo Layout**

```
apps/
  api/           # NestJS REST API
  dashboard/     # Angular and Tailwind frontend
data/
  src/        
    lib/        # Shared modules & utilities (interfaces, DTOs, constants)
```

* Monorepo enables shared code, consistent coding standards, and easier dependency management between frontend and backend.
* DTOs, interfaces, and common utility functions are placed in `lib/` to avoid duplication.

---

## Data Model Explanation

### **Core Entities**

* **User**: id, username, password, role, organization
* **Task**: id, title, description, status, creatorId, assigneeId

---

## Access Control Implementation

* **Roles**: `user`, `admin`, `owner`
* **Permissions**: CRUD operations are checked against the role and organization hierarchy
* **JWT Authentication**:

  * Users log in with JWT tokens
  * Tokens carry role and org data for access checks
  * Guards in the backend verify permissions on each endpoint

> Example: Only owners can delete tasks created by admins in their organization.

---

## API Documentation

### **Sample Endpoints**

| Endpoint      | Method | Description              | Sample Request                               | Sample Response                         |
| ------------- | ------ | ------------------------ | -------------------------------------------- | --------------------------------------- |
| `/auth/login` | POST   | Login and receive JWT    | `{ "username": "john", "password": "1234" }` | `{ "token": "..." }`                    |
| `/tasks`      | GET    | Get all tasks for a user | `-`                                          | `[ { "id":1, "title":"Task 1", ... } ]` |
| `/tasks`      | POST   | Create a new task        | `{ "title":"New Task", "assigneeId":2 }`     | `{ "id":5, "title":"New Task", ... }`   |
| `/tasks/:id`  | DELETE | Delete a task            | `-`                                          | `{ "message":"Deleted" }`               |

> Use your JWT token in the `Authorization` header for protected routes:
> `Authorization: Bearer <token>`

---

## Future Considerations
* General:
  * Configure test file for testing 
* Backend:
  * Allow temporary or scoped permissions.
  * JWT refresh tokens
  * CSRF protection
  * Caching of RBAC checks
  * Implement access due to organizational hierarchy
  * Optimize permission checks for large organizations
* Frontend:
  * Impliment tailwind themes and theme switch properly and more efficiently
  * Better task completion visualization (e.g., bar chart)

---

## Authors
Developed by: [@AhmadAzeez999](https://github.com/AhmadAzeez999)

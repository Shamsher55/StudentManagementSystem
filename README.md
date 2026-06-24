# Student Management System

An Angular 21 frontend for the Student Management System. Provides a full-featured UI for managing schools, students, teachers, admissions, courses, exams, fees, grades, attendance, timetable, and events.

## Tech Stack

- **Angular 21** (standalone components, lazy-loaded modules)
- **TypeScript**
- **HttpClient** with JWT interceptor
- **Hash-based routing**

## Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Angular CLI](https://angular.dev/tools/cli): `npm install -g @angular/cli`
- The [Student Management API](https://github.com/Shamsher55/StudentManagementAPI) running locally

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Shamsher55/StudentManagementSystem.git
cd StudentManagementSystem
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the dev server

Make sure the API is running at `http://localhost:5244`, then:

```bash
ng serve
```

Open `http://localhost:4200` in your browser.

> API requests are proxied to `http://localhost:5244` via `proxy.conf.json`.

## Default Login Credentials

| Role        | Email                 | Password  |
|-------------|-----------------------|-----------|
| Super Admin | superadmin@sms.edu    | super123  |

## Environment Configuration

| File                                          | Used for    | API URL                     |
|-----------------------------------------------|-------------|-----------------------------|
| `src/environments/environment.ts`             | Development | `http://localhost:5244/api` |
| `src/environments/environment.production.ts`  | Production  | `/api` (relative)           |

## Production Build

Build and copy output to the API's `wwwroot/` to serve everything from one host:

```bash
ng build --configuration production
```

Then copy `dist/student-management-system/*` into the API's `wwwroot/` folder.

## Features

- **Multi-school support** — superadmin manages all schools; school admins are scoped to their own school
- **Role-based access** — Super Admin, Admin, Teacher, Student roles with guarded routes
- **Admissions** — apply, approve, reject with status tracking
- **Students & Teachers** — full CRUD with school scoping
- **Courses, Exams & Grades** — manage curriculum and results
- **Attendance** — mark and view attendance records
- **Fees** — track payments and outstanding balances
- **Timetable** — weekly schedule view
- **Events** — school calendar
- **Dashboard** — stats overview per role
- **Reports** — student progress summaries

## Related Repository

.NET 8 backend API: [StudentManagementAPI](https://github.com/Shamsher55/StudentManagementAPI)

# School Management System API

A RESTful API for managing a school system built with Node.js, Express, Prisma ORM, and PostgreSQL (Neon).

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL (Neon serverless)
- **Auth**: JWT (cookie + Bearer token)
- **File Upload**: Multer (local storage)

---

## Getting Started

### Prerequisites

- Node.js v18+
- A [Neon](https://neon.tech) PostgreSQL database

### Installation

```bash
git clone https://github.com/MizuLy/school-management-system-api.git
cd school-management-system-api
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your_jwt_secret
PORT=6969
FRONTEND_URL=http://localhost:5173
```

### Database Setup

```bash
npx prisma migrate dev
```

### Run

```bash
npm run dev
```

---

## Roles

| Role | Description |
|------|-------------|
| `ADMIN` | Full access, manages everything |
| `TEACHER` | Manages classes, grades, attendance |
| `STUDENT` | Views assignments, submits work |
| `GUARDIAN` | Views their child's grades and info |

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register admin account |
| POST | `/login` | Public | Login |
| POST | `/logout` | Public | Logout |
| GET | `/:id` | Auth | Get current user |

---

### Registration Token — `/api/register`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/generate` | Admin | Generate QR registration token |
| POST | `/:token` | Public | Student self-registration via token |

---

### Teachers — `/api/teachers`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Admin | Create teacher account |
| GET | `/` | Public | Get all teachers |
| PUT | `/:id` | Admin | Update teacher |
| DELETE | `/:id` | Admin | Remove teacher |

---

### Students — `/api/students`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Auth | Get all students |
| PUT | `/:id` | Admin | Update student |
| DELETE | `/:id` | Admin | Remove student |

---

### Guardians — `/api/guardians`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Admin | Create guardian account |
| GET | `/` | Auth | Get all guardians with students |
| PUT | `/:id` | Admin | Update guardian |
| DELETE | `/:id` | Admin | Remove guardian |

---

### Courses — `/api/courses`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Admin | Create course |
| GET | `/` | Public | Get all courses |
| PUT | `/:id` | Admin | Update course |
| DELETE | `/:id` | Admin | Remove course |

---

### Classes — `/api/classes`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Admin | Create class |
| GET | `/` | Auth | Get all classes |
| PUT | `/:id` | Admin | Update class |
| DELETE | `/:id` | Admin | Remove class |

---

### Class Enrollment — `/api/enroll`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Admin | Enroll student into class |
| GET | `/` | Auth | Get all enrollments |
| DELETE | `/:id` | Admin | Unenroll student |

---

### Assignments — `/api/assignments`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Teacher | Post assignment |
| GET | `/?classId=` | Auth | Get assignments by class |
| PUT | `/:id` | Teacher | Update assignment |
| DELETE | `/:id` | Teacher | Remove assignment |

---

### Submissions — `/api/submissions`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Student | Submit assignment |
| GET | `/` | Auth | Get submissions |
| PUT | `/:id` | Student | Update submission |
| DELETE | `/:id` | Auth | Remove submission |

---

### Grades — `/api/grades`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Teacher | Grade a submission |
| GET | `/` | Auth | Get grades (filtered by role) |
| PUT | `/:id` | Teacher | Update grade |
| DELETE | `/:id` | Teacher | Remove grade |

---

### Attendance

#### Student Attendance — `/api/student-attendances`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Teacher | Mark student attendance |
| GET | `/` | Auth | Get student attendances |
| PUT | `/:id` | Teacher | Update student attendance |

#### Teacher Attendance — `/api/teacher-attendances`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Admin | Mark teacher attendance |
| GET | `/` | Auth | Get teacher attendances |
| PUT | `/:id` | Admin | Update teacher attendance |

---

### Permission Requests — `/api/permissions`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Auth | Submit permission request |
| GET | `/` | Auth | Get all permission requests |
| PATCH | `/:id` | Teacher/Admin | Approve or deny request |
| DELETE | `/:id` | Admin | Remove request |

---

### Events — `/api/events`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Admin | Post event/announcement |
| GET | `/` | Public | Get all events |
| PUT | `/:id` | Admin | Update event |
| DELETE | `/:id` | Admin | Remove event |

---

## Attendance Status

`PRESENT` / `ABSENT` / `LATE` / `PERMISSION`

## Permission Request Status

`PENDING` / `APPROVED` / `DENIED`

---

## Notes

- File uploads are stored in `/uploads` folder
- All IDs are UUIDs
- Dates should be in `YYYY-MM-DD` format
- Status enums are uppercase

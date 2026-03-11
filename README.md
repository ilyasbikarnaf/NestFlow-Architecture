# 🚀 NestFlow Architecture

NestFlow is a robust, enterprise-grade backend built with **NestJS v11**. It features a modular architecture designed for scalability, with secure authentication (JWT & Google OAuth), cloud storage integration, and automated email workflows.

---

## 🛠️ Tech Stack

| Category        | Technology            | Key Libraries                                              |
| --------------- | --------------------- | ---------------------------------------------------------- |
| Framework       | NestJS                | `@nestjs/core`, `@nestjs/common`                           |
| Database        | PostgreSQL            | `TypeORM`, `pg`                                            |
| Auth / Security | Passport + JWT        | `passport`, `@nestjs/jwt`, `bcrypt`, `google-auth-library` |
| Storage         | AWS S3                | `@aws-sdk/client-s3`                                       |
| Email           | Nodemailer            | `@nestjs-modules/mailer`, `nodemailer`, `ejs`              |
| Validation      | Class-Validator + Joi | `class-validator`, `joi`                                   |
| Documentation   | Compodoc + Swagger    | `@compodoc/compodoc`, `@nestjs/swagger`                    |

---

## ✨ Features

### 🔐 Authentication & Security

- **Hybrid Auth System** — supports standard Email/Password login and Google Social Login
- **JWT Strategy** — implements Access and Refresh tokens for secure, stateless sessions
- **Role-Based Guards** — custom decorators (`@ActiveUser`) and Guards (`AccessTokenGuard`) to protect sensitive endpoints

### 📦 Media & Storage

- **AWS S3 Integration** — dedicated `UploadsModule` for file buffering and direct streaming to S3 buckets
- **Entity Linking** — uploaded files are tracked in the database and linked to users or posts via a relational schema

### 📧 Automated Communications

- **MailModule** — a decoupled mailing service built on Nodemailer
- **Dynamic Templating** — EJS-powered HTML email templates (e.g., Welcome Emails on registration)
- **Mailtrap Integration** — configured for safe SMTP testing and debugging in non-production environments

### 🏗️ Architecture & Best Practices

- **Modular Design** — separate modules for `Users`, `Posts`, `Auth`, `Mail`, and `Uploads` enforce clean separation of concerns
- **Environment Safety** — strict Joi validation of `.env` variables prevents the app from starting with missing credentials
- **DTO-Driven** — all incoming data is validated and typed through Data Transfer Objects

---

## 🚦 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-username/nestflow-architecture.git
cd nestflow-architecture
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=nest_db

# AWS S3
AWS_BUCKET_NAME=your_bucket
AWS_REGION=your_region
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

# Mail (Mailtrap)
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_user
MAIL_PASS=your_pass
```

> ⚠️ The app will **refuse to start** if any required environment variables are missing — this is enforced via Joi schema validation on boot.

### 3. Run the App

```bash
# Development (watch mode)
npm run start:dev

# Production
npm run build
npm run start:prod
```

---

## 📈 Documentation

NestFlow uses **Compodoc** for architectural diagrams and **Swagger** for API reference.

**Compodoc** (full module/dependency diagrams):

```bash
npx @compodoc/compodoc -p tsconfig.json -s
```

Available at `http://localhost:8080`

**Swagger UI** (interactive API docs):  
Available at `http://localhost:3000/api` when the app is running.

---

## 📜 License

This project is licensed under the **MIT License**.

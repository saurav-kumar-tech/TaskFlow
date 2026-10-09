# TaskFlow — Task Management Application

A full-stack task management web application built with **Java Spring Boot, MySQL, Spring Security/JWT, WebSocket and responsive HTML/CSS/JavaScript**.

## Features

- User registration and login
- JWT authentication and protected APIs
- User-specific task authorization
- Full CRUD for tasks
- Status: Pending / In Progress / Completed
- Priority: Low / Medium / High
- Due dates
- Categories and tags
- Dashboard statistics
- Search and filters
- Responsive desktop/mobile UI
- Light/Dark theme
- Browser notifications
- Real-time task-change updates with WebSocket
- Clean REST API

## Requirements

- Java 17+
- Maven 3.9+ (or Maven Wrapper if generated locally)
- MySQL 8+

## Database setup

Create the database:

```sql
CREATE DATABASE task_manager;
```

Default configuration is:

```text
DB_URL=jdbc:mysql://localhost:3306/task_manager?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=Asia/Kolkata
DB_USERNAME=root
DB_PASSWORD=root
```

If your MySQL password is different, set environment variable `DB_PASSWORD` or edit `src/main/resources/application.properties`.

## Run

From the project folder:

```bash
mvn spring-boot:run
```

Then open:

```text
http://localhost:8080
```

Or build a JAR:

```bash
mvn clean package
java -jar target/task-management-1.0.0.jar
```

## API endpoints

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/{id}
PATCH  /api/tasks/{id}/status?value=COMPLETED
DELETE /api/tasks/{id}
```

## Project structure

```text
task-management-app/
├── src/main/java/com/taskmanager/
│   ├── config/
│   ├── controller/
│   ├── dto/
│   ├── model/
│   ├── repository/
│   ├── security/
│   ├── service/
│   └── websocket/
├── src/main/resources/static/
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
├── schema.sql
├── pom.xml
├── run.bat
└── README.md
```

## Notes

The frontend is served by Spring Boot, so there is no separate Node.js setup. For production, replace the development JWT secret with a strong environment variable and configure a specific allowed frontend origin instead of `*`.

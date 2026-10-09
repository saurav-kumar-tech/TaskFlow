# 🚀 TaskFlow — Smart Task Management System

<p align="center">
  <img src="https://img.shields.io/badge/Java-Spring%20Boot-orange?style=for-the-badge&logo=springboot" alt="Java Spring Boot"/>
  <img src="https://img.shields.io/badge/Database-MySQL-blue?style=for-the-badge&logo=mysql" alt="MySQL"/>
  <img src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-purple?style=for-the-badge" alt="Frontend"/>
  <img src="https://img.shields.io/badge/Security-JWT-green?style=for-the-badge" alt="JWT Security"/>
</p>

<p align="center">
  <strong>A modern task management application for organizing daily work, tracking progress, managing priorities, and monitoring productivity.</strong>
</p>

<p align="center">
  <a href="https://github.com/saurav-kumar-tech/TaskFlow">📂 Repository</a> •
  <a href="#-screenshots">📸 Screenshots</a> •
  <a href="#-installation--setup">⚙️ Installation</a>
</p>

---

## 📌 Overview

**TaskFlow** is a full-stack task management application built using Java, Spring Boot, MySQL, and a web-based frontend.

It provides a centralized workspace for managing tasks, organizing priorities, monitoring progress, and reviewing productivity analytics through a clean and intuitive interface.

The project combines backend development, database integration, authentication, and frontend design to demonstrate the development of a structured web application.

### 🎯 Project Objectives

- Simplify everyday task management.
- Organize tasks and priorities in one place.
- Provide a dashboard for monitoring progress.
- Integrate a relational database for persistent storage.
- Implement authentication and protected backend endpoints.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 Authentication | Registration and login with JWT-based authentication |
| 📊 Dashboard | Centralized view of task information and progress |
| ✅ Task Management | Create, view, update, and manage tasks |
| 🎯 Priority Management | Organize tasks according to priority |
| 📈 Analytics | Review task progress and productivity information |
| ⚙️ Settings | Access application preferences and settings |
| 🔔 WebSocket Support | Backend support for real-time task notifications |
| 🗄️ MySQL Integration | Store application data in a relational database |
| 🛡️ Backend Security | Spring Security configuration and protected API endpoints |
| 🎨 Web Interface | HTML, CSS, and JavaScript-based user interface |

---

## 🛠️ Tech Stack

### Backend
- **Java** — Core programming language
- **Spring Boot** — Backend application framework
- **Spring Security** — Security configuration
- **JWT** — Token-based authentication
- **Spring Data JPA / Hibernate** — Database operations and ORM
- **WebSocket** — Real-time communication support
- **Maven** — Build and dependency management

### Frontend
- **HTML5** — Page structure
- **CSS3** — Styling and layout
- **JavaScript** — Client-side interactions

### Database
- **MySQL** — Relational database

### Development Tools
- Visual Studio Code
- Git and GitHub
- Apache Maven

---

## 📸 Screenshots

The following screenshots showcase the TaskFlow interface.

### 1. 🔐 Login Page

<p align="center">
  <img src="screenshots/1-login.png" alt="TaskFlow Login Page" width="90%"/>
</p>

<p align="center"><em>Login interface for accessing the application.</em></p>

### 2. 📊 Dashboard

<p align="center">
  <img src="screenshots/2-dashboard.png" alt="TaskFlow Dashboard" width="90%"/>
</p>

<p align="center"><em>A centralized view for tracking tasks and productivity.</em></p>

### 3. ✅ Task Management

<p align="center">
  <img src="screenshots/3-task-management.png" alt="TaskFlow Task Management" width="90%"/>
</p>

<p align="center"><em>Manage tasks and organize work in one place.</em></p>

### 4. 📈 Analytics

<p align="center">
  <img src="screenshots/4-analytics.png" alt="TaskFlow Analytics" width="90%"/>
</p>

<p align="center"><em>Review task progress and analytics.</em></p>

### 5. ⚙️ Settings

<p align="center">
  <img src="screenshots/5-settings.png" alt="TaskFlow Settings" width="90%"/>
</p>

<p align="center"><em>Application settings and preferences.</em></p>

---

## ⚙️ Installation & Setup

Follow these steps to run TaskFlow locally.

### Prerequisites

Install the following software:

- Java JDK
- Apache Maven
- MySQL Server
- Git (optional)

### Step 1: Clone the Repository

```bash
git clone https://github.com/saurav-kumar-tech/TaskFlow.git
cd TaskFlow
```

### Step 2: Create the Database

Open MySQL and execute:

```sql
CREATE DATABASE task_manager;
```

### Step 3: Configure Environment Variables

TaskFlow reads database connection settings and its JWT signing secret from environment variables.

| Variable | Purpose |
|---|---|
| `DB_URL` | MySQL connection URL |
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `JWT_SECRET` | Secret used for JWT signing |

For a local MySQL installation, the connection URL can be:

```text
jdbc:mysql://localhost:3306/task_manager?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=Asia/Kolkata&allowPublicKeyRetrieval=true
```

Set the variables in your operating system or IDE environment:

```text
DB_URL=<your_mysql_connection_url>
DB_USERNAME=<your_mysql_username>
DB_PASSWORD=<your_mysql_password>
JWT_SECRET=<your_secure_generated_secret>
```

**Windows PowerShell example** (for the current terminal session):

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/task_manager?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=Asia/Kolkata&allowPublicKeyRetrieval=true"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
$env:JWT_SECRET="your_secure_generated_secret"
```

Replace the example values with your own configuration. Use a strong, randomly generated JWT secret that meets the application's signing requirements.

> **Security note:** Never commit actual database credentials or JWT secrets to GitHub. The PowerShell commands above apply only to the current terminal session.

### Step 4: Run the Application

From the project root, run:

```bash
mvn spring-boot:run
```

Alternatively, on Windows, you can try the included script:

```bat
run.bat
```

Ensure MySQL is running and the environment variables are configured before starting the application.

### Step 5: Open TaskFlow

Once the application starts successfully, open:

**http://localhost:8080**

---

## 📁 Project Structure

```text
TaskFlow/
├── screenshots/
│   ├── 1-login.png
│   ├── 2-dashboard.png
│   ├── 3-task-management.png
│   ├── 4-analytics.png
│   └── 5-settings.png
├── src/
│   └── main/
│       ├── java/com/taskmanager/
│       │   ├── config/
│       │   ├── controller/
│       │   ├── dto/
│       │   ├── model/
│       │   ├── repository/
│       │   ├── security/
│       │   ├── service/
│       │   └── websocket/
│       └── resources/
│           ├── application.properties
│           └── static/
│               ├── css/
│               ├── js/
│               └── index.html
├── .gitignore
├── pom.xml
├── README.md
└── run.bat
```

---

## 🔒 Security & Configuration

- Database connection details are supplied through environment variables.
- JWT signing uses the `JWT_SECRET` environment variable.
- Never publish passwords, private keys, production secrets, or database backups.
- Use HTTPS and secure environment configuration when deploying publicly.
- Review authentication, authorization, CORS, and database settings before production deployment.

---

## 🌐 Live Demo

**Live application:** Not deployed yet.

The GitHub repository and its README are publicly accessible, but GitHub Pages does not run the Java Spring Boot backend or provide the MySQL database required by this application.

Once the application is deployed to a compatible hosting platform and configured with a reachable database, add the actual application URL here:

```text
https://your-deployed-application-url
```

> Do not use the GitHub Pages README URL as the application demo link. Replace this section with the verified deployment URL when the backend is live.

---

## 🔮 Future Enhancements

- [ ] Deploy the backend with a managed production database
- [ ] Add email notifications and task reminders
- [ ] Improve task filtering and search
- [ ] Expand analytics and reporting
- [ ] Add automated tests and CI/CD
- [ ] Further improve the mobile experience

---

## 👨‍💻 Developer

**Saurav Kumar**

Java | Spring Boot | MySQL | Web Development

- **GitHub:** [saurav-kumar-tech](https://github.com/saurav-kumar-tech)
- **Project Repository:** [TaskFlow](https://github.com/saurav-kumar-tech/TaskFlow)

---

## 📄 License

No license has been specified yet. If you intend to distribute this project or permit reuse, consider adding an appropriate open-source license.

---

<p align="center">
  <strong>⭐ If you find TaskFlow interesting, consider starring the repository!</strong>
</p>

<p align="center">
  Built with Java, Spring Boot, MySQL, and a focus on productive task management.
</p>

# 🚀 TaskFlow — Smart Task Management System

<p align="center">
  <img src="https://img.shields.io/badge/Java-Spring%20Boot-orange?style=for-the-badge&logo=springboot" alt="Java Spring Boot"/>
  <img src="https://img.shields.io/badge/Database-MySQL-blue?style=for-the-badge&logo=mysql" alt="MySQL"/>
  <img src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-purple?style=for-the-badge" alt="Frontend"/>
  <img src="https://img.shields.io/badge/Security-JWT-green?style=for-the-badge" alt="JWT Security"/>
</p>

<p align="center">
  <strong>A modern, secure, and intuitive task management application designed to organize work, track productivity, and manage daily tasks efficiently.</strong>
</p>

<p align="center">
  <a href="https://saurav-kumar-tech.github.io/TaskFlow/">🌐 Live Demo</a> •
  <a href="#-screenshots">📸 Screenshots</a> •
  <a href="#-installation--setup">⚙️ Installation</a>
</p>

---

## 📌 Overview

**TaskFlow** is a full-stack task management application built with Java and Spring Boot. It provides a centralized workspace for managing tasks, monitoring progress, organizing priorities, and viewing productivity analytics.

With a clean interface, authentication, and an organized dashboard, TaskFlow aims to make everyday task management simpler and more efficient.

> **Project Goal:** Build a practical task management solution that combines a modern user interface with a structured backend, database integration, and secure authentication.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 User Authentication | Registration, login, and JWT-based authentication |
| 📊 Dashboard | View and organize tasks from a centralized dashboard |
| ✅ Task Management | Create, view, update, and manage tasks |
| 🎯 Priority Management | Organize tasks according to their priority |
| 📈 Analytics | Visualize task progress and productivity information |
| ⚙️ Settings | Access application preferences and settings |
| 🔔 WebSocket Support | Backend support for real-time task notifications |
| 🗄️ Database Integration | Persist application data using MySQL |
| 🛡️ Security | Spring Security configuration and protected API endpoints |
| 📱 Modern Interface | Responsive-style layout with dedicated CSS and JavaScript assets |

---

## 🛠️ Tech Stack

### Backend
- **Java** — Core programming language
- **Spring Boot** — Application framework
- **Spring Security** — Authentication and security
- **JWT** — Token-based authentication
- **Spring Data JPA / Hibernate** — Database access and ORM
- **Maven** — Dependency and build management
- **WebSocket** — Real-time communication support

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

Explore the TaskFlow interface through the screenshots below.

### 1️⃣ Login Page
<p align="center">
  <img src="screenshots/1-login.png" alt="TaskFlow Login Page" width="90%"/>
</p>

<p align="center"><em>Authentication screen for accessing the application.</em></p>

---

### 2️⃣ Dashboard
<p align="center">
  <img src="screenshots/2-dashboard.png" alt="TaskFlow Dashboard" width="90%"/>
</p>

<p align="center"><em>A centralized view for tracking tasks and productivity.</em></p>

---

### 3️⃣ Task Management
<p align="center">
  <img src="screenshots/3-task-management.png" alt="TaskFlow Task Management" width="90%"/>
</p>

<p align="center"><em>Manage tasks and organize work in one place.</em></p>

---

### 4️⃣ Analytics
<p align="center">
  <img src="screenshots/4-analytics.png" alt="TaskFlow Analytics" width="90%"/>
</p>

<p align="center"><em>Review task-related analytics and progress information.</em></p>

---

### 5️⃣ Settings
<p align="center">
  <img src="screenshots/5-settings.png" alt="TaskFlow Settings" width="90%"/>
</p>

<p align="center"><em>Access application settings and preferences.</em></p>

---

## ⚙️ Installation & Setup

Follow these steps to run TaskFlow locally.

### Prerequisites

Make sure you have installed:

- Java JDK
- Apache Maven
- MySQL Server
- Git (optional)

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/TaskFlow.git
cd TaskFlow
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 2: Create the Database

Open MySQL and create the database:

```sql
CREATE DATABASE task_manager;
```

### Step 3: Configure Environment Variables

The application reads its database settings and JWT secret from environment variables.

Configure the following variables on your system:

| Variable | Purpose |
|---|---|
| `DB_URL` | MySQL connection URL |
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `JWT_SECRET` | Secret used for JWT signing |

Example for a local MySQL database:

```text
DB_URL=jdbc:mysql://localhost:3306/task_manager?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=Asia/Kolkata&allowPublicKeyRetrieval=true
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_generated_secret
```

**Security note:** These are example values, not a configuration file. Set the variables in your environment and never publish actual passwords or JWT secrets to GitHub.

### Step 4: Run the Application

From the project root, run:

```bash
mvn spring-boot:run
```

Alternatively, if your local setup supports the included Windows script, you can use:

```bat
run.bat
```

### Step 5: Open TaskFlow

Once the application starts successfully, open:

**http://localhost:8080**

Make sure MySQL is running and your environment variables are configured before starting the application.

---

## 📁 Project Structure

```text
TaskFlow/
│
├── screenshots/
│   ├── 1-login.png
│   ├── 2-dashboard.png
│   ├── 3-task-management.png
│   ├── 4-analytics.png
│   └── 5-settings.png
│
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
│       │
│       └── resources/
│           ├── application.properties
│           └── static/
│               ├── css/
│               ├── js/
│               └── index.html
│
├── .gitignore
├── pom.xml
├── README.md
└── run.bat
```

---

## 🔒 Security & Configuration

- Database credentials are supplied through environment variables.
- JWT signing uses the `JWT_SECRET` environment variable.
- Do not commit passwords, private keys, production secrets, or database backups.
- Use a strong, securely generated JWT secret.
- Configure appropriate security settings before deploying publicly.

---

## 🚀 Live Demo

<p align="center">
  <a href="PASTE_YOUR_LIVE_LINK_HERE">
    <strong>🌐 Open TaskFlow Live Demo</strong>
  </a>
</p>

**Live URL:** `https://saurav-kumar-tech.github.io/TaskFlow/`

> Replace the placeholder with your actual deployed application URL when hosting is ready. A GitHub repository link alone does not deploy the Spring Boot backend or MySQL database.

---

## 🔮 Future Enhancements

- [ ] Cloud deployment with a production database
- [ ] Email notifications and reminders
- [ ] Advanced task filtering and search
- [ ] Enhanced analytics and reporting
- [ ] Automated testing and CI/CD
- [ ] Improved mobile experience

---

## 👨‍💻 Developer

**Saurav Kumar**

Java | Spring Boot | MySQL | Full-Stack Development

- GitHub: [@saurav-kumar-tech](https://github.com/saurav-kumar-tech)

---

## 📄 License

No license has been specified yet. Add a license if you intend to distribute or reuse this project under defined terms.

---

<p align="center">
  <strong>⭐ If you find TaskFlow interesting, consider starring the repository!</strong>
</p>

<p align="center">
  <em>Built with Java, Spring Boot, and a focus on productive task management.</em>
</p>

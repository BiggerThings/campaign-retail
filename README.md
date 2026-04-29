# Node.js TypeScript PostgreSQL CRM API

A complete, containerized CRUD API built with **Node.js**, **TypeScript**, and **PostgreSQL**. This project follows the **MVC (Model-View-Controller)** architecture and is fully orchestrated using **Docker Compose**.

## 🏗️ Project Architecture
The application is organized into a modular folder structure to ensure scalability and maintainability:

- **`src/models/`**: Direct database interactions and SQL queries.
- **`src/controllers/`**: Logic for handling requests and sending responses.
- **`src/routes/`**: Definition of API endpoints.
- **`src/db.ts`**: Database connection pooling using `pg`.
- **`src/index.ts`**: The main entry point of the application.

## 🛠️ Tech Stack
- **Runtime**: Node.js (v20+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (v15-alpine)
- **Containerization**: Docker & Docker Compose

## 🗄️ Database Schema
The database consists of three primary tables:

1. **Customers**: `id`, `first_name`, `last_name`, `dob`, `city`, `created_at`
2. **Campaigns**: `id`, `name`, `total_customers_participated`
3. **Stores**: `id`, `name`, `location`

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Docker** and **Docker Compose** installed on your machine.

### 2. Installation & Setup
Clone the repository and navigate to the project directory:

```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
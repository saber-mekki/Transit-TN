# Transit TN

Transit TN is a full-stack web application designed to streamline transit information across Tunisia. It covers various modes of transportation including Louages (shared taxis), national buses, and international cargo transporters. The platform provides real-time trip information, schedules, seat availability, and a live map to track active vehicles.

This application is built with a modern, scalable architecture, featuring a React frontend, a Node.js backend, and a PostgreSQL database, all containerized with Docker for easy setup and deployment.

## Tech Stack

- **Frontend**:
  - React 19
  - TypeScript
  - Tailwind CSS for styling
  - Leaflet.js for interactive maps

- **Backend**:
  - Node.js with Express.js
  - TypeScript

- **Database**:
  - PostgreSQL
  - Prisma ORM for type-safe database access

- **Deployment & Orchestration**:
  - Docker & Docker Compose

## Project Structure

The project is organized into a monorepo with two main packages: `frontend` and `backend`.

```
.
├── backend/              # Node.js backend server
│   ├── prisma/
│   │   ├── migrations/   # Database migration files
│   │   ├── schema.prisma # Defines the database schema
│   │   └── seed.ts       # Database seed script
│   ├── src/              # Backend source code (routes, data, etc.)
│   ├── Dockerfile        # Instructions to build the backend image
│   └── ...
├── frontend/             # React frontend application
│   ├── components/
│   ├── contexts/
│   ├── index.html
│   └── ...
├── docker-compose.yml    # Orchestrates all services (backend, db)
└── README.md             # This file
```

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/products/docker-desktop/) (which includes Docker Compose)

## Getting Started: Local Setup

Follow these steps to get the application running on your local machine.

### Step 1: Clone the Repository

First, clone the project repository to your local machine using Git.

```bash
git clone <your-repository-url>
cd <project-directory>
```

### Step 2: Configure Environment Variables (Optional)

The backend requires a `.env` file for developers who wish to run Prisma commands or the Node.js server directly on their host machine (outside of Docker).

1.  Navigate to the `backend` directory: `cd backend`
2.  Create a copy of the example environment file and name it `.env`:
    ```bash
    cp .env.example .env
    ```
**Note**: For the standard Docker setup, the `DATABASE_URL` is set directly in the `docker-compose.yml` file and this `.env` file is **not** used by the running container.

### Step 3: Run the Application with Docker Compose

Return to the project's root directory and use Docker Compose to build and start all the services.

```bash
# From the root directory of the project
docker-compose up --build
```

**What does this command do?**
- `--build`: Forces Docker to rebuild the backend image. Use this the first time or after making changes to the backend code.
- It starts the PostgreSQL database (`db`) and the backend server (`backend`).
- The backend container will automatically wait for the database to be healthy, apply any database migrations, and start the server on port 3000.

The initial build may take a few minutes.

### Step 4: Access the Application

- **Frontend Application**: The simplest way to run the frontend is to use a local web server.
  - If you have Node.js installed, open a **new terminal window**.
  - Navigate to the `frontend` directory and use `npx` to start a server on port **3001**:
    ```bash
    cd frontend
    npx serve -l 3001
    ```
  - Now, open your browser and go to **`http://localhost:3001`**.

- **Backend API**: The backend server is accessible at `http://localhost:3000`.
- **Database**: The database is accessible from your host machine on port **5433**.

## Database Management

- **Schema**: The database schema is defined in `backend/prisma/schema.prisma`.
- **Creating a new migration**: After changing the schema, run:
  ```bash
  docker-compose exec backend npx prisma migrate dev --name <your-migration-name>
  ```
- **Re-seeding the database**: To reset the data, run:
  ```bash
  docker-compose exec backend npx prisma db seed
  ```

## Stopping the Application

To stop all running containers, press `Ctrl + C` in the terminal where `docker-compose up` is running. To remove the containers, run:

```bash
docker-compose down
```
To also remove the database volume (deleting all data), run `docker-compose down -v`.

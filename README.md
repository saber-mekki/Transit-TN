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
  - Node.js
  - Express.js
  - TypeScript

- **Database**:
  - PostgreSQL
  - Prisma ORM for type-safe database access

- **Deployment & Orchestration**:
  - Docker
  - Docker Compose

## Project Structure

The project is organized into a monorepo with two main packages: `frontend` and `backend`.

```
.
├── backend/              # Node.js backend server
│   ├── prisma/
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

### Step 2: Configure Environment Variables

The backend requires a `.env` file for developers who wish to run Prisma commands or the Node.js server directly on their host machine (outside of Docker).

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create a copy of the example environment file and name it `.env`:
    ```bash
    cp .env.example .env
    ```

**Note**: For the standard Docker setup (`docker-compose up`), the `DATABASE_URL` is set directly in the `docker-compose.yml` file and the `.env` file is **not** used by the running container. The `.env` file is provided for reference and for local development workflows that don't use Docker containers for the backend service.

### Step 3: Run the Application with Docker Compose

Once you are ready, return to the project's root directory and use Docker Compose to build and start all the services (backend server and database).

```bash
# From the root directory of the project
docker-compose up --build
```

**What does this command do?**
- `--build`: This flag tells Docker Compose to build the backend image from `backend/Dockerfile` before starting the service. You only need to use this the first time or after making changes to the backend's `Dockerfile`.
- It starts the PostgreSQL database container (`db`).
- It starts the backend server container (`backend`).
- The backend container will automatically:
  - Wait for the database to be ready.
  - Apply any pending database migrations using Prisma.
  - Seed the database with initial data from `backend/prisma/seed.ts`.
  - Start the Express server on port 3000.

The initial build process may take a few minutes. Once it's complete, you will see logs from both the database and the backend server in your terminal.

### Step 4: Access the Application

- **Frontend Application**: To view the frontend, you need to serve the `frontend` directory with a local web server. An easy way to do this is to use a simple command line server.
  - Make sure you have Node.js installed.
  - Install a static server globally: `npm install -g serve`
  - Navigate to the `frontend` directory and run the server:
    ```bash
    cd frontend
    serve -l 3001 
    ```
  - Open your browser and go to `http://localhost:3001`.

- **Backend API**: The backend server is accessible at `http://localhost:3000`. You can test endpoints using a tool like Postman or `curl` (e.g., `curl http://localhost:3000/api/trips`).

## Database Management

The application uses **Prisma** as an ORM to manage the database schema and queries.

- **Schema**: The database schema is defined in `backend/prisma/schema.prisma`. Any changes to the database structure should be made here.
- **Migrations**: Migrations are handled automatically by the Docker entrypoint script. However, if you need to create a new migration after changing the schema, you can run:
  ```bash
  docker-compose exec backend npx prisma migrate dev --name <your-migration-name>
  ```
- **Seeding**: The database is seeded automatically on the first startup. If you want to re-seed the database to reset the data, you can run:
  ```bash
  docker-compose exec backend npx prisma db seed
  ```

## Stopping the Application

To stop all the running containers, press `Ctrl + C` in the terminal where `docker-compose up` is running. To remove the containers and the network, run:

```bash
docker-compose down
```

To also remove the database volume (deleting all data), run:
```bash
docker-compose down -v
```
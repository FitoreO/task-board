# Task Board

Task management application built with React, Express, and Prisma.

## Features

- User authentication with login
- CRUD operations for lists and tasks
- Drag-and-drop tasks between lists
- Task descriptions and details

## Tech Stack

### Frontend

- **React 19**
- **Vite**
- **Material UI (MUI)**
- **React DnD**

### Backend

- **Express**
- **Prisma**
- **SQLite**

## Installation

1. Install dependencies:

```bash
npm install
```

2. Setup .env file:

```
DATABASE_URL="file:./dev.db"
CLIENT_PORT=5173
SERVER_PORT=3000
```

3. Initialize the prisma client:

```bash
npm run prisma:generate
```

## Running the Project

### Development Mode (Frontend + Backend)

Start both the Vite dev server and Express backend:

```bash
npm run serve
```

This runs two processes:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

### Frontend Only

```bash
npm run dev
```

Runs on `http://localhost:5173`

### Backend Only

```bash
npm run dev:server
```

Runs on `http://localhost:3000`

### Production Build

```bash
npm run build
```

Creates optimized production build in `dist/` folder

### Preview Production Build

```bash
npm run preview
```

## NPM Scripts Summary

| Command                   | Purpose                               |
| ------------------------- | ------------------------------------- |
| `npm run dev`             | Start Vite dev server (frontend only) |
| `npm run dev:server`      | Start Express server (backend only)   |
| `npm run serve`           | Start both frontend and backend       |
| `npm run build`           | Build for production                  |
| `npm run preview`         | Preview production build              |
| `npm run format`          | Format code using Prettier            |
| `npm run prisma:generate` | Generate Prisma client                |

## Project Structure

```
src/               # React frontend
  components/      # React components
  App.tsx          # Main app component
  main.tsx         # Entry point

server/            # Express backend
  routes/          # API route handlers
  index.ts         # Server entry point
  prisma.ts        # Prisma client setup

prisma/
  schema.prisma    # Database schema
  migrations/      # Database migrations
```

## Database Schema

- **User** - Authentication and user data
- **List** - Task lists belonging to users
- **Task** - Individual tasks within lists

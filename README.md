# Taskflow — Full-stack Todo App

Production-style monorepo: **React (Vite) + Tailwind** client, **Express + MongoDB** API, **JWT** auth, and a single dev command.

## Prerequisites

- **Node.js 18+** only  
- **No MongoDB install required for local development** — if `MONGODB_URI` is not set, the API uses an **in-memory MongoDB** (via `mongodb-memory-server`). The first start may download a MongoDB binary once (can take a minute).

## Run with one command (after install)

From the project root:

```bash
npm install
npm run dev
```

`npm install` runs **postinstall**, which creates **`server/.env`** from **`server/.env.example`** if it is missing.

Then open **http://localhost:5173**.

| Service    | URL                         |
|-----------|-----------------------------|
| Frontend  | http://localhost:5173       |
| Backend   | http://localhost:5000       |
| Health    | http://localhost:5000/api/health |

In development, Vite proxies **`/api`** to the backend.

## Environment (optional for local dev)

### Backend (`server/.env`)

- **`MONGODB_URI`**: optional in development. If unset or empty, the server uses **in-memory MongoDB**. Set it to use Docker, local `mongod`, or **Atlas**.
- **`JWT_SECRET`**: optional in development (a dev-only default is applied). **Required** in production.
- **`PORT`**, **`CLIENT_ORIGIN`**, **`JWT_EXPIRES_IN`**: see **`server/.env.example`**.

### Frontend (`client/.env`) — optional

Not required in dev. For production builds:

```env
VITE_API_URL=https://your-api-domain.com/api
```

## Scripts

| Command        | Description                              |
|----------------|------------------------------------------|
| `npm run dev`  | Runs API + client together (concurrently) |
| `npm run build`| Builds the client for production         |
| `npm start`    | Runs the API only (`node` on `server`)   |

## Using a real MongoDB (optional)

- **Local / Docker:** set `MONGODB_URI` in `server/.env` (e.g. `mongodb://127.0.0.1:27017/taskflow`).
- **Atlas:** paste your SRV connection string as `MONGODB_URI`.

## Deploy on Render

This repo includes a **`render.yaml`** Blueprint for:

- **`todolist-web`**: React/Vite static site
- **`todolist-api`**: Express API service

In Render, create a new **Blueprint** from this GitHub repository and select `render.yaml`.
Render will generate `JWT_SECRET` automatically and prompt for `MONGODB_URI`.

Use a production MongoDB connection string, such as MongoDB Atlas:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/taskflow?retryWrites=true&w=majority
```

The Blueprint wires the frontend URL into backend CORS and the backend URL into the Vite build.

## Architecture

- **`client/`** — React app, Tailwind, React Router, Axios, Zustand, protected routes, dashboard UI.
- **`server/`** — Express REST API, MVC-style layout, JWT, validation, centralized errors, Mongoose models.

## License

MIT

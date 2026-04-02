# Todo List App

A simple todo list web app built with Deno + Hono on the backend and Preact + Tailwind CSS on the frontend.

## Prerequisites

- [Deno](https://deno.com/) 2.x

## Setup

Install frontend dependencies (only needed once):

```sh
deno install
```

## Development

Run the backend and frontend dev servers in separate terminals:

**Terminal 1 — API server (port 8000):**
```sh
deno task dev:server
```

**Terminal 2 — Frontend dev server (port 5173):**
```sh
deno task dev:client
```

Then open [http://localhost:5173](http://localhost:5173).

The frontend proxies `/api` requests to the backend automatically, so both servers must be running during development.

## Production

Build the frontend and start the server:

```sh
deno task build:client
deno task start
```

Then open [http://localhost:8000](http://localhost:8000). Hono serves both the API and the static frontend from a single process.

## Available Tasks

| Task | Description |
|------|-------------|
| `deno task dev:server` | Start the Hono API server with file watching |
| `deno task dev:client` | Start the Vite frontend dev server |
| `deno task build:client` | Build the frontend for production |
| `deno task start` | Start the production server |

## Features

- Add todos
- Mark todos as complete
- Delete todos
- Rename the list

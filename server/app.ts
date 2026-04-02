import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/deno";
import listsRoutes from "./routes/lists.ts";
import listTodosRoutes from "./routes/listTodos.ts";

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE"],
    allowHeaders: ["Content-Type"],
  }),
);

app.route("/api/lists", listsRoutes);
app.route("/api/lists/:listId/todos", listTodosRoutes);

if (Deno.env.get("DENO_ENV") === "production") {
  app.use("/*", serveStatic({ root: "./client/dist" }));
  app.get("*", serveStatic({ path: "./client/dist/index.html" }));
}

export default app;

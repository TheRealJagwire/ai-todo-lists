import { Hono } from "hono";
import { addTodo, deleteTodo, getTodos, reorderTodos, updateTodo } from "../db.ts";

const listTodos = new Hono();

listTodos.get("/", (c) => {
  const listId = c.req.param("listId");
  if (!listId) return c.json({ error: "missing listId" }, 400);
  const todos = getTodos(listId);
  if (!todos) return c.json({ error: "list not found" }, 404);
  return c.json(todos);
});

listTodos.post("/", async (c) => {
  const listId = c.req.param("listId");
  if (!listId) return c.json({ error: "missing listId" }, 400);
  const body = await c.req.json<{ text?: string }>();
  if (typeof body.text !== "string" || body.text.trim() === "") {
    return c.json({ error: "text is required" }, 400);
  }
  const todo = addTodo(listId, body.text.trim());
  if (!todo) return c.json({ error: "list not found" }, 404);
  return c.json(todo, 201);
});

// PATCH / (reorder) must come before PATCH /:id
listTodos.patch("/", async (c) => {
  const listId = c.req.param("listId");
  if (!listId) return c.json({ error: "missing listId" }, 400);
  const body = await c.req.json<{ orderedIds?: unknown }>();
  if (!Array.isArray(body.orderedIds)) {
    return c.json({ error: "orderedIds must be an array" }, 400);
  }
  const result = reorderTodos(listId, body.orderedIds as string[]);
  if (!result) return c.json({ error: "orderedIds does not match current todos" }, 409);
  return c.json(result);
});

listTodos.patch("/:id", async (c) => {
  const listId = c.req.param("listId");
  if (!listId) return c.json({ error: "missing listId" }, 400);
  const id = c.req.param("id");
  const body = await c.req.json<{ completed?: boolean; text?: string }>();
  const todo = updateTodo(listId, id, body);
  if (!todo) return c.json({ error: "not found" }, 404);
  return c.json(todo);
});

listTodos.delete("/:id", (c) => {
  const listId = c.req.param("listId");
  if (!listId) return c.json({ error: "missing listId" }, 400);
  const id = c.req.param("id");
  const deleted = deleteTodo(listId, id);
  if (!deleted) return c.json({ error: "not found" }, 404);
  return new Response(null, { status: 204 });
});

export default listTodos;

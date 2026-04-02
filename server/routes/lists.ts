import { Hono } from "hono";
import {
  createList,
  deleteList,
  getLists,
  getListsWithTodos,
  reorderLists,
  updateListName,
} from "../db.ts";

const lists = new Hono();

// /bootstrap must come before /:id or Hono matches "bootstrap" as an id
lists.get("/bootstrap", (c) => {
  return c.json(getListsWithTodos());
});

lists.get("/", (c) => {
  return c.json(getLists());
});

lists.post("/", async (c) => {
  const body = await c.req.json<{ name?: string }>();
  if (typeof body.name !== "string" || body.name.trim() === "") {
    return c.json({ error: "name is required" }, 400);
  }
  return c.json(createList(body.name.trim()), 201);
});

// PATCH / (reorder) must come before PATCH /:id
lists.patch("/", async (c) => {
  const body = await c.req.json<{ orderedIds?: unknown }>();
  if (!Array.isArray(body.orderedIds)) {
    return c.json({ error: "orderedIds must be an array" }, 400);
  }
  const result = reorderLists(body.orderedIds as string[]);
  if (!result) return c.json({ error: "orderedIds does not match current lists" }, 409);
  return c.json(result);
});

lists.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<{ name?: string }>();
  if (typeof body.name !== "string" || body.name.trim() === "") {
    return c.json({ error: "name is required" }, 400);
  }
  const result = updateListName(id, body.name.trim());
  if (!result) return c.json({ error: "not found" }, 404);
  return c.json(result);
});

lists.delete("/:id", (c) => {
  const id = c.req.param("id");
  const deleted = deleteList(id);
  if (!deleted) return c.json({ error: "not found" }, 404);
  return new Response(null, { status: 204 });
});

export default lists;

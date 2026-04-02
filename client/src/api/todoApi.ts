import type { ListMeta, Todo, TodoList } from "../types";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

// ── Lists ─────────────────────────────────────────────────────────────────

export async function fetchAllLists(): Promise<TodoList[]> {
  return json(await fetch("/api/lists/bootstrap"));
}

export async function createList(name: string): Promise<ListMeta> {
  return json(
    await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }),
  );
}

export async function patchListName(listId: string, name: string): Promise<ListMeta> {
  return json(
    await fetch(`/api/lists/${listId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }),
  );
}

export async function deleteList(listId: string): Promise<void> {
  const res = await fetch(`/api/lists/${listId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(res.statusText);
}

export async function reorderLists(orderedIds: string[]): Promise<ListMeta[]> {
  return json(
    await fetch("/api/lists", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds }),
    }),
  );
}

// ── Todos ─────────────────────────────────────────────────────────────────

export async function createTodo(listId: string, text: string): Promise<Todo> {
  return json(
    await fetch(`/api/lists/${listId}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }),
  );
}

export async function patchTodo(
  listId: string,
  id: string,
  changes: Partial<Pick<Todo, "completed" | "text">>,
): Promise<Todo> {
  return json(
    await fetch(`/api/lists/${listId}/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    }),
  );
}

export async function deleteTodo(listId: string, id: string): Promise<void> {
  const res = await fetch(`/api/lists/${listId}/todos/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(res.statusText);
}

export async function reorderTodos(listId: string, orderedIds: string[]): Promise<Todo[]> {
  return json(
    await fetch(`/api/lists/${listId}/todos`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds }),
    }),
  );
}

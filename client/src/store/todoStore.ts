import { signal } from "@preact/signals";
import type { ListState } from "../types";
import * as api from "../api/todoApi";

export const lists = signal<ListState[]>([]);
export const isBootstrapping = signal<boolean>(false);
export const bootstrapError = signal<string | null>(null);

function updateList(listId: string, patch: Partial<ListState>): void {
  lists.value = lists.value.map((l) => (l.id === listId ? { ...l, ...patch } : l));
}

// ── Bootstrap ──────────────────────────────────────────────────────────────

export async function loadAll(): Promise<void> {
  isBootstrapping.value = true;
  bootstrapError.value = null;
  try {
    const data = await api.fetchAllLists();
    lists.value = data.map((l) => ({ ...l, isLoading: false, error: null }));
  } catch (e) {
    bootstrapError.value = (e as Error).message;
  } finally {
    isBootstrapping.value = false;
  }
}

// ── List-level actions ─────────────────────────────────────────────────────

export async function createList(): Promise<void> {
  try {
    const meta = await api.createList("New List");
    lists.value = [...lists.value, { ...meta, todos: [], isLoading: false, error: null }];
  } catch (e) {
    bootstrapError.value = (e as Error).message;
  }
}

export async function reorderLists(orderedIds: string[]): Promise<void> {
  const previous = lists.value;
  const map = new Map(previous.map((l) => [l.id, l]));
  lists.value = orderedIds.map((id) => map.get(id)!); // optimistic
  try {
    await api.reorderLists(orderedIds); // confirm (server returns metadata only; keep local state)
  } catch (e) {
    lists.value = previous; // rollback
    bootstrapError.value = (e as Error).message;
  }
}

export async function deleteList(listId: string): Promise<void> {
  try {
    await api.deleteList(listId);
    lists.value = lists.value.filter((l) => l.id !== listId);
  } catch (e) {
    updateList(listId, { error: (e as Error).message });
  }
}

export async function renameList(listId: string, name: string): Promise<void> {
  try {
    const updated = await api.patchListName(listId, name);
    updateList(listId, { name: updated.name });
  } catch (e) {
    updateList(listId, { error: (e as Error).message });
  }
}

// ── Todo-level actions ─────────────────────────────────────────────────────

export async function addTodo(listId: string, text: string): Promise<void> {
  try {
    const todo = await api.createTodo(listId, text);
    const list = lists.value.find((l) => l.id === listId);
    if (!list) return;
    updateList(listId, { todos: [...list.todos, todo] });
  } catch (e) {
    updateList(listId, { error: (e as Error).message });
  }
}

export async function toggleTodo(listId: string, todoId: string): Promise<void> {
  const list = lists.value.find((l) => l.id === listId);
  const todo = list?.todos.find((t) => t.id === todoId);
  if (!todo || !list) return;
  try {
    const updated = await api.patchTodo(listId, todoId, { completed: !todo.completed });
    updateList(listId, { todos: list.todos.map((t) => (t.id === todoId ? updated : t)) });
  } catch (e) {
    updateList(listId, { error: (e as Error).message });
  }
}

export async function deleteTodo(listId: string, todoId: string): Promise<void> {
  const list = lists.value.find((l) => l.id === listId);
  if (!list) return;
  try {
    await api.deleteTodo(listId, todoId);
    updateList(listId, { todos: list.todos.filter((t) => t.id !== todoId) });
  } catch (e) {
    updateList(listId, { error: (e as Error).message });
  }
}

export async function reorderTodos(listId: string, orderedIds: string[]): Promise<void> {
  const list = lists.value.find((l) => l.id === listId);
  if (!list) return;
  const previous = list.todos;
  const map = new Map(previous.map((t) => [t.id, t]));
  updateList(listId, { todos: orderedIds.map((id) => map.get(id)!) });
  try {
    const confirmed = await api.reorderTodos(listId, orderedIds);
    updateList(listId, { todos: confirmed });
  } catch (e) {
    updateList(listId, { todos: previous, error: (e as Error).message });
  }
}

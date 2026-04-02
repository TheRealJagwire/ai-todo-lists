import type { Todo, TodoList } from "./models/types.ts";

const defaultList: TodoList = { id: "default", name: "My Todos", todos: [] };
const stores = new Map<string, TodoList>([["default", defaultList]]);

// ── List-level ────────────────────────────────────────────────────────────

export function getLists(): Omit<TodoList, "todos">[] {
  return [...stores.values()].map(({ id, name }) => ({ id, name }));
}

export function getListsWithTodos(): TodoList[] {
  return [...stores.values()];
}

export function createList(name: string): Omit<TodoList, "todos"> {
  const list: TodoList = { id: crypto.randomUUID(), name, todos: [] };
  stores.set(list.id, list);
  return { id: list.id, name: list.name };
}

export function updateListName(
  listId: string,
  name: string,
): Omit<TodoList, "todos"> | undefined {
  const list = stores.get(listId);
  if (!list) return undefined;
  list.name = name;
  return { id: list.id, name: list.name };
}

export function deleteList(listId: string): boolean {
  return stores.delete(listId);
}

export function reorderLists(orderedIds: string[]): Omit<TodoList, "todos">[] | undefined {
  if (orderedIds.length !== stores.size) return undefined;
  const reordered = new Map<string, TodoList>();
  for (const id of orderedIds) {
    const list = stores.get(id);
    if (!list) return undefined;
    reordered.set(id, list);
  }
  stores.clear();
  for (const [id, list] of reordered) {
    stores.set(id, list);
  }
  return [...stores.values()].map(({ id, name }) => ({ id, name }));
}

// ── Todo-level ────────────────────────────────────────────────────────────

export function getTodos(listId: string): Todo[] | undefined {
  return stores.get(listId)?.todos;
}

export function addTodo(listId: string, text: string): Todo | undefined {
  const list = stores.get(listId);
  if (!list) return undefined;
  const todo: Todo = {
    id: crypto.randomUUID(),
    text,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  list.todos.push(todo);
  return todo;
}

export function updateTodo(
  listId: string,
  id: string,
  changes: Partial<Pick<Todo, "completed" | "text">>,
): Todo | undefined {
  const todo = stores.get(listId)?.todos.find((t) => t.id === id);
  if (!todo) return undefined;
  if (changes.completed !== undefined) todo.completed = changes.completed;
  if (changes.text !== undefined) todo.text = changes.text;
  return todo;
}

export function deleteTodo(listId: string, id: string): boolean {
  const list = stores.get(listId);
  if (!list) return false;
  const idx = list.todos.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  list.todos.splice(idx, 1);
  return true;
}

export function reorderTodos(
  listId: string,
  orderedIds: string[],
): Todo[] | undefined {
  const list = stores.get(listId);
  if (!list) return undefined;
  if (orderedIds.length !== list.todos.length) return undefined;
  const map = new Map(list.todos.map((t) => [t.id, t]));
  if (orderedIds.some((id) => !map.has(id))) return undefined;
  list.todos = orderedIds.map((id) => map.get(id)!);
  return list.todos;
}

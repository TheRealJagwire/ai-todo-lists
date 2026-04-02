import { useRef } from "preact/hooks";
import type { Todo } from "../types";
import { TodoItem } from "./TodoItem";

interface Props {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
}

export function TodoList({ todos, onToggle, onDelete, onReorder }: Props) {
  const dragId = useRef<string | null>(null);
  const dragOverId = useRef<string | null>(null);

  if (todos.length === 0) {
    return (
      <p class="text-gray-500 text-center mt-8">No todos yet. Add one above!</p>
    );
  }

  function handleDragStart(e: DragEvent, id: string) {
    dragId.current = id;
    (e.currentTarget as HTMLElement).classList.add("todo-dragging");
  }

  function handleDragEnter(e: DragEvent, id: string) {
    e.preventDefault();
    dragOverId.current = id;
    (e.currentTarget as HTMLElement).classList.add("todo-drag-over");
  }

  function handleDragLeave(e: DragEvent) {
    (e.currentTarget as HTMLElement).classList.remove("todo-drag-over");
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
  }

  function handleDrop(e: DragEvent, targetId: string) {
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.remove("todo-drag-over");

    const sourceId = dragId.current;
    if (!sourceId || sourceId === targetId) return;

    const ids = todos.map((t) => t.id);
    const fromIdx = ids.indexOf(sourceId);
    const toIdx = ids.indexOf(targetId);
    if (fromIdx === -1 || toIdx === -1) return;

    const reordered = [...ids];
    reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, sourceId);

    dragId.current = null;
    dragOverId.current = null;
    onReorder(reordered);
  }

  function handleDragEnd(e: DragEvent) {
    (e.currentTarget as HTMLElement).classList.remove("todo-dragging");
    // Clean up any lingering drag-over highlights
    document
      .querySelectorAll(".todo-drag-over")
      .forEach((el) => el.classList.remove("todo-drag-over"));
    dragId.current = null;
    dragOverId.current = null;
  }

  return (
    <ul class="mt-4 flex flex-col gap-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggle(todo.id)}
          onDelete={() => onDelete(todo.id)}
          draggable={true}
          onDragStart={(e) => handleDragStart(e, todo.id)}
          onDragEnter={(e) => handleDragEnter(e, todo.id)}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, todo.id)}
          onDragEnd={handleDragEnd}
        />
      ))}
    </ul>
  );
}

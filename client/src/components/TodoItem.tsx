import type { Todo } from "../types";

interface Props {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  draggable: true;
  onDragStart: (e: DragEvent) => void;
  onDragEnter: (e: DragEvent) => void;
  onDragLeave: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  onDragEnd: (e: DragEvent) => void;
}

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  draggable,
  onDragStart,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onDragEnd,
}: Props) {
  return (
    <li
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      class="flex items-center gap-3 p-3 bg-gray-800 border border-gray-700 rounded-xl group cursor-grab active:cursor-grabbing hover:border-gray-500 transition-colors"
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
        class="w-4 h-4 accent-blue-500 cursor-pointer flex-none"
      />
      <span
        class={`flex-1 text-sm ${todo.completed ? "line-through text-gray-500" : "text-gray-100"}`}
      >
        {todo.text}
      </span>
      <button
        onClick={onDelete}
        class="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all flex-none"
        aria-label="Delete todo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </button>
    </li>
  );
}

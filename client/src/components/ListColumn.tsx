import type { ListState } from "../types";
import {
  addTodo,
  deleteList,
  deleteTodo,
  renameList,
  reorderTodos,
  toggleTodo,
} from "../store/todoStore";
import { ListHeader } from "./ListHeader";
import { TodoInput } from "./TodoInput";
import { TodoList } from "./TodoList";

interface Props {
  list: ListState;
  onDragStart: (e: DragEvent) => void;
  onDragEnd: (e: DragEvent) => void;
}

export function ListColumn({ list, onDragStart, onDragEnd }: Props) {
  return (
    <div class="flex-none w-80 bg-gray-900 rounded-2xl shadow-md p-6 flex flex-col">
      <div class="flex items-start justify-between gap-2">
        {/* Drag handle */}
        <div
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          class="mt-2 flex-none cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-400 transition-colors select-none text-lg leading-none"
          title="Drag to reorder"
        >
          ⠿
        </div>
        <div class="flex-1 min-w-0">
          <ListHeader
            listName={list.name}
            onRename={(name) => renameList(list.id, name)}
          />
        </div>
        <button
          onClick={() => deleteList(list.id)}
          class="mt-2 flex-none text-gray-600 hover:text-red-400 transition-colors text-base leading-none"
          aria-label="Delete list"
          title="Delete list"
        >
          ✕
        </button>
      </div>
      <TodoInput onAdd={(text) => addTodo(list.id, text)} />
      {list.error && <p class="text-red-400 text-xs mt-2">{list.error}</p>}
      {list.isLoading
        ? <p class="text-gray-500 text-center mt-6 text-sm">Loading...</p>
        : (
          <TodoList
            todos={list.todos}
            onToggle={(id) => toggleTodo(list.id, id)}
            onDelete={(id) => deleteTodo(list.id, id)}
            onReorder={(ids) => reorderTodos(list.id, ids)}
          />
        )}
    </div>
  );
}

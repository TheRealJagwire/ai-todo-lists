import { useEffect, useRef } from "preact/hooks";
import {
  bootstrapError,
  createList,
  isBootstrapping,
  lists,
  loadAll,
  reorderLists,
} from "../store/todoStore";
import { isDark, toggleTheme } from "../store/themeStore";
import { ListColumn } from "./ListColumn";

export function App() {
  const dragListId = useRef<string | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  function handleListDragStart(e: DragEvent, id: string) {
    dragListId.current = id;
    document.querySelector(`[data-list-id="${id}"]`)?.classList.add("list-dragging");
  }

  function handleListDragEnter(e: DragEvent, id: string) {
    if (!dragListId.current) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.add("list-drag-over");
  }

  function handleListDragLeave(e: DragEvent) {
    if ((e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) return;
    (e.currentTarget as HTMLElement).classList.remove("list-drag-over");
  }

  function handleListDragOver(e: DragEvent) {
    if (!dragListId.current) return;
    e.preventDefault();
  }

  function handleListDrop(e: DragEvent, targetId: string) {
    if (!dragListId.current) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.remove("list-drag-over");
    const sourceId = dragListId.current;
    dragListId.current = null;
    if (sourceId === targetId) return;
    const ids = lists.value.map((l) => l.id);
    const fromIdx = ids.indexOf(sourceId);
    const toIdx = ids.indexOf(targetId);
    if (fromIdx === -1 || toIdx === -1) return;
    const reordered = [...ids];
    reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, sourceId);
    reorderLists(reordered);
  }

  function handleListDragEnd(_e: DragEvent) {
    if (dragListId.current) {
      document.querySelector(`[data-list-id="${dragListId.current}"]`)?.classList.remove("list-dragging");
    }
    dragListId.current = null;
    document.querySelectorAll(".list-drag-over").forEach((el) => el.classList.remove("list-drag-over"));
  }

  return (
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <header class="flex items-center justify-between px-8 py-5 border-b border-gray-200 dark:border-gray-800 flex-none">
        <h1 class="text-xl font-semibold text-gray-700 dark:text-gray-300 tracking-wide">Todos</h1>
        <div class="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            aria-label="Toggle theme"
            title={isDark.value ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark.value ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => createList()}
            class="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
          >
            + New List
          </button>
        </div>
      </header>

      {isBootstrapping.value && (
        <p class="text-gray-500 text-center mt-16">Loading...</p>
      )}
      {bootstrapError.value && (
        <p class="text-red-400 text-center mt-16">{bootstrapError.value}</p>
      )}

      {!isBootstrapping.value && (
        <main class="flex-1 overflow-x-auto">
          <div class="flex gap-4 p-8 items-start min-h-full">
            {lists.value.map((list) => (
              <div
                key={list.id}
                data-list-id={list.id}
                onDragEnter={(e) => handleListDragEnter(e, list.id)}
                onDragLeave={handleListDragLeave}
                onDragOver={handleListDragOver}
                onDrop={(e) => handleListDrop(e, list.id)}
                class="rounded-2xl transition-opacity"
              >
                <ListColumn
                  list={list}
                  onDragStart={(e) => handleListDragStart(e, list.id)}
                  onDragEnd={handleListDragEnd}
                />
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}

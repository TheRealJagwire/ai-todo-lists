import { useEffect, useRef } from "preact/hooks";
import {
  bootstrapError,
  createList,
  isBootstrapping,
  lists,
  loadAll,
  reorderLists,
} from "../store/todoStore";
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
    // Ignore if the pointer is still within this element (moved to a child)
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
    <div class="min-h-screen bg-gray-950 flex flex-col">
      <header class="flex items-center justify-between px-8 py-5 border-b border-gray-800 flex-none">
        <h1 class="text-xl font-semibold text-gray-300 tracking-wide">Todos</h1>
        <button
          onClick={() => createList()}
          class="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
        >
          + New List
        </button>
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

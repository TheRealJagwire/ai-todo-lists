import { useState } from "preact/hooks";

interface Props {
  onAdd: (text: string) => void;
}

export function TodoInput({ onAdd }: Props) {
  const [value, setValue] = useState("");

  function handleSubmit(e: Event) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} class="flex gap-2 mt-6">
      <input
        class="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        type="text"
        placeholder="Add a new todo..."
        value={value}
        onInput={(e) => setValue((e.target as HTMLInputElement).value)}
      />
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-lg transition-colors"
      >
        Add
      </button>
    </form>
  );
}

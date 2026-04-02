import { useState } from "preact/hooks";

interface Props {
  listName: string;
  onRename: (name: string) => void;
}

export function ListHeader({ listName, onRename }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(listName);

  function startEdit() {
    setValue(listName);
    setEditing(true);
  }

  function commit() {
    const trimmed = value.trim();
    if (trimmed) onRename(trimmed);
    setEditing(false);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") setEditing(false);
  }

  if (editing) {
    return (
      <input
        class="text-3xl font-bold w-full border-b-2 border-blue-400 outline-none bg-transparent text-gray-100 py-1"
        value={value}
        onInput={(e) => setValue((e.target as HTMLInputElement).value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    );
  }

  return (
    <h1
      class="text-3xl font-bold text-gray-100 cursor-pointer hover:text-blue-400 transition-colors"
      onClick={startEdit}
      title="Click to rename"
    >
      {listName}
    </h1>
  );
}

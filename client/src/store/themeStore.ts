import { signal } from "@preact/signals";

const stored = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialDark = stored ? stored === "dark" : prefersDark;

export const isDark = signal<boolean>(initialDark);

if (initialDark) {
  document.documentElement.classList.add("dark");
}

export function toggleTheme(): void {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}

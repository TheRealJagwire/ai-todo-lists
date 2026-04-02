export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface TodoList {
  id: string;
  name: string;
  todos: Todo[];
}

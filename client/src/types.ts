export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface ListMeta {
  id: string;
  name: string;
}

export interface TodoList extends ListMeta {
  todos: Todo[];
}

export interface ListState extends TodoList {
  isLoading: boolean;
  error: string | null;
}

type Task = {
  label: string;
  completed: boolean;
};

type UseTodo = {
  inputValue: string;
  tasks: Task[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTaskAdd: () => void;
  handleTaskComplete: (index: number) => void;
  handleTaskDelete: (index: number) => void;
};

export type { Task, UseTodo };

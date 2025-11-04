import { ChangeEvent, useState } from 'react';

import type { Task, UseTodo } from '@/types/UseTodo';

const useTodo = (): UseTodo => {
  const [inputValue, setInputValue] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
  };

  const handleTaskAdd = () => {
    if (!inputValue) {
      return;
    }
    setTasks((prev) => [...prev, { label: inputValue, completed: false }]);
    setInputValue('');
  };

  const handleTaskComplete = (index: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((prevTask, i) =>
        i === index ? { ...prevTask, completed: !prevTask.completed } : prevTask,
      ),
    );
  };

  const handleTaskDelete = (index: number) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  return {
    inputValue,
    tasks,
    handleInputChange,
    handleTaskAdd,
    handleTaskComplete,
    handleTaskDelete,
  };
};

export default useTodo;

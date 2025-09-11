import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Task } from "@/graphql/generated/graphql";

interface TaskStore {
  tasks: Task[];
  getTasks: () => Task[];
  addTask: (task: Task) => void;
  updateTaskById: (id: string, updates: Partial<Task>) => void;
  removeTaskById: (id: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      getTasks: () => get().tasks,
      addTask: (task: Task) =>
        set((state) => ({ tasks: [task, ...state.tasks] })),
      updateTaskById: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          ),
        })),
      removeTaskById: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

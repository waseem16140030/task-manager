import { useUserStore, generateMockUsers, useTaskStore } from ".";

export const getServerUserStore = () => {
  
  if (typeof window === "undefined") {
    const store = useUserStore.getState();
    if (store.users.length === 0) {
      store.hydrate(generateMockUsers());
    }
  }
  return useUserStore.getState();
};

export const getServerTaskStore = () => {
  if (typeof window === "undefined") {
    const store = useTaskStore.getState();
    if (store.tasks.length === 0) {
      store.hydrate([]); 
    }
  }
  return useTaskStore.getState();
};


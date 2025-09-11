export const createUniversalStorage = () => {
  if (typeof window === "undefined") {
    const memoryStorage: Record<string, string> = {};
    return {
      getItem: (key: string): string | null => memoryStorage[key] ?? null,
      setItem: (key: string, value: string): void => {
        memoryStorage[key] = value;
      },
      removeItem: (key: string): void => {
        delete memoryStorage[key];
      },
    };
  } else {
    return {
      getItem: (key: string): string | null => localStorage.getItem(key),
      setItem: (key: string, value: string): void => localStorage.setItem(key, value),
      removeItem: (key: string): void => localStorage.removeItem(key),
    };
  }
};
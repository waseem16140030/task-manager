// app/lib/storage.ts
export const createUniversalStorage = () => {
  if (typeof window === "undefined") {
    const memoryStorage: Record<string, string> = {};
    return {
      getItem: (key: string) => memoryStorage[key] ?? null,
      setItem: (key: string, value: string) => {
        memoryStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete memoryStorage[key];
      },
    };
  } else {
    // Client: localStorage
    return localStorage;
  }
};

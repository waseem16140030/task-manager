"use client";
import { useEffect, useState } from "react";
import { initMocks } from "@/app/shared/lib/init-mocks";

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeMocks = async () => {
      try {
        await initMocks();
        setIsReady(true);
      } catch (error) {
        setIsReady(false)
      }
    }
    initializeMocks();
  }, []);


  if (!isReady) return null

  return <>{children}</>;
}

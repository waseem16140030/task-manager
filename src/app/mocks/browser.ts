import { setupWorker } from 'msw/browser';
import { handlers } from '@/app/lib/handlers';

export function createWorker() {
  return setupWorker(...handlers);
}

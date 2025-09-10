import { setupServer } from "msw/node";
import { handlers } from "@/app/lib/handlers";

export const server = setupServer(...handlers);

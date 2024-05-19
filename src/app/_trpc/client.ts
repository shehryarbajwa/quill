import { AppRouter } from "@/trpc";
import { CreateTRPCReact, createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>({})
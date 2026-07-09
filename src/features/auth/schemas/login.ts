import { z } from "zod";

export const loginSchema = z.object({
  redirectTo: z.string().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

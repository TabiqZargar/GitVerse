import { z } from "zod";

export const yearQuerySchema = z.object({
  currentDate: z.string().optional(),
  year: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : new Date().getFullYear())),
});

export const usernameYearSchema = z.object({
  username: z.string().optional(),
  year: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : new Date().getFullYear())),
});

export const refreshQuerySchema = z.object({
  refresh: z
    .string()
    .optional()
    .transform((v) => v === "true"),
});

export const currentDateOnlySchema = z.object({
  currentDate: z.string().optional(),
});

export function safeParseQuery<T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
  searchParams: URLSearchParams
): z.infer<T> {
  const raw: Record<string, unknown> = {};
  searchParams.forEach((value, key) => {
    raw[key] = value;
  });
  return schema.parse(raw);
}

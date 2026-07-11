import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(1),
  AUTH_GITHUB_ID: z.string().min(1),
  AUTH_GITHUB_SECRET: z.string().min(1),
  GITHUB_ACCESS_TOKEN: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NARRATIVE_API_URL: z.string().url().optional(),
  NARRATIVE_API_KEY: z.string().min(1).optional(),
  NARRATIVE_MODEL: z.string().default("gpt-4"),
  AUTH_GITHUB_TOKEN: z.string().optional(),
});

const parsed = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
  AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
  GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NARRATIVE_API_URL: process.env.NARRATIVE_API_URL,
  NARRATIVE_API_KEY: process.env.NARRATIVE_API_KEY,
  NARRATIVE_MODEL: process.env.NARRATIVE_MODEL,
  AUTH_GITHUB_TOKEN: process.env.AUTH_GITHUB_TOKEN,
});

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;

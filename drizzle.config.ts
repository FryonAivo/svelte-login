import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
  out: "./src/lib/server/db",
  schema: "./src/lib/server/db/schema.ts",
});
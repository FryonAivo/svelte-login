import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "$env/dynamic/private";
import * as schema from "./schema";

const connection = mysql.createPool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME
    // not including port since it's 3306
});

export const db = drizzle(connection, { schema, mode: "default" });
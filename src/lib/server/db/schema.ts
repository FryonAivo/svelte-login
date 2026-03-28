import { mysqlTable, index, bigint, foreignKey, unique, int, mysqlEnum, varchar, datetime, time } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const oauthAccounts = mysqlTable("oauth_accounts", {
	id: int().autoincrement().notNull().primaryKey(),
	userId: varchar("user_id", { length: 36 }).notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "restrict" }),
	provider: mysqlEnum(['Google','GitHub','Microsoft','Apple ID']).notNull(),
	providerUserId: varchar("provider_user_id", { length: 256 }).notNull(),
	accessToken: varchar("access_token", { length: 256 }).default('NULL'),
	refreshToken: varchar("refresh_token", { length: 256 }).default('NULL'),
	tokenExpiresAt: datetime("token_expires_at", { mode: 'string'}).default(sql`(now() + interval 30 minute)`),
	name: varchar({ length: 256 }).notNull(),
},
(table) => [
	index("user_id").on(table.userId),
	unique("provider").on(table.provider, table.providerUserId),
]);

export const sessions = mysqlTable("sessions", {
	id: bigint({ mode: "number" }).autoincrement().notNull().primaryKey(),
	sessionToken: varchar("session_token", { length: 256 }).notNull(),
	userId: varchar("user_id", { length: 36 }).notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "restrict" }),
	expiresAt: datetime("expires_at", { mode: 'string'}).default(sql`(now() + interval 30 minute)`),
},
(table) => [
	index("user_id").on(table.userId),
	unique("session_token").on(table.sessionToken),
]);

export const users = mysqlTable("users", {
	id: varchar("id", { length: 36 }).notNull().primaryKey(),
	email: varchar({ length: 256 }).notNull(),
	hashedPassword: varchar("hashed_password", { length: 256 }).default('NULL'),
	name: varchar({ length: 256 }).notNull(),
},
(table) => [
	unique("email").on(table.email),
]);

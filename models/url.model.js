import { uuid, text, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model.js";
import "dotenv/config";

export const urlTable = pgTable("urls", {
    id: uuid().primaryKey().defaultRandom(),

    shortCode: varchar("code", { length: 155 }).notNull().unique(),
    targetUrl: text("target_url").notNull(),

    userId: uuid("user_id")
        .references(() => usersTable.id)
        .notNull(),

    ceratedAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

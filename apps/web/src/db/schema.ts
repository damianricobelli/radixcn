import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { ThemeSelection } from "@/lib/theme-generator/types";

export const themes = sqliteTable("themes", {
  hash: text("hash").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  selection: text("selection", { mode: "json" }).$type<ThemeSelection>().notNull(),
  editable: integer("editable", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type ThemeRow = typeof themes.$inferSelect;

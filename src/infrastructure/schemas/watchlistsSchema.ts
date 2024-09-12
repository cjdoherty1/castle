import { text, bigint, bigserial } from "drizzle-orm/pg-core";
import { castleSchema } from "./castleSchema";

export const watchlistsTable = castleSchema.table("watchlists", {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    userId: text("user_id"),
    watchlistName: text("watchlist_name"),
});

export type InsertWatchlist = typeof watchlistsTable.$inferInsert;
export type SelectWatchlist = typeof watchlistsTable.$inferSelect;

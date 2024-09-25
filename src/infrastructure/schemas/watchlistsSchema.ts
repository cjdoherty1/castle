import { text, bigserial, boolean } from "drizzle-orm/pg-core";
import { castleSchema } from "./castleSchema";

export const watchlistsTable = castleSchema.table("watchlists", {
    watchlistId: bigserial("watchlist_id", { mode: "number" }).primaryKey(),
    userId: text("user_id"),
    watchlistName: text("watchlist_name"),
    isWatchedList: boolean('is_watched_list'),
});

export type InsertWatchlist = typeof watchlistsTable.$inferInsert;
export type SelectWatchlist = typeof watchlistsTable.$inferSelect;

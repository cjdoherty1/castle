import { text, bigserial, uuid, boolean } from "drizzle-orm/pg-core";
import { castleSchema } from "./castleSchema";

export const watchlistsTable = castleSchema.table("watchlists", {
    watchlistId: uuid("watchlist_id").primaryKey(),
    userId: uuid("user_id"),
    watchlistName: uuid("watchlist_name"),
    isWatchedList: boolean('is_watched_list'),
});

export type InsertWatchlist = typeof watchlistsTable.$inferInsert;
export type SelectWatchlist = typeof watchlistsTable.$inferSelect;

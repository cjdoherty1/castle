import { bigint, text, uuid } from "drizzle-orm/pg-core";
import { castleSchema } from "./castleSchema";

export const watchlistItemsTable = castleSchema.table("watchlist_items", {
    watchlistItemId: uuid("watchlist_item_id").primaryKey(),
    watchlistId: uuid("watchlist_id"),
    movieId: bigint("movie_id", { mode: "number" }),
});

export type InsertWatchlistItem = typeof watchlistItemsTable.$inferInsert;
export type SelectWatchlistItem = typeof watchlistItemsTable.$inferSelect;

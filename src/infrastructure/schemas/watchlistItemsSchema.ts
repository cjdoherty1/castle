import { bigint, bigserial } from 'drizzle-orm/pg-core';
import { castleSchema } from './castleSchema';

export const watchlistItemsTable = castleSchema.table('watchlist_items', {
  id: bigserial('id', { mode: 'number'}).primaryKey(),
  watchlistId: bigint('watchlist_id', { mode: 'number'}),
  movieId: bigint('movie_id', { mode: 'number'})
});

export type InsertWatchlistItem = typeof watchlistItemsTable.$inferInsert;
export type SelectWatchlistItem = typeof watchlistItemsTable.$inferSelect;

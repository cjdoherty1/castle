import { bigint, bigserial } from 'drizzle-orm/pg-core';
import { castleSchema } from './castleSchema';

export const watchlistsTable = castleSchema.table('watchlists', {
  id: bigserial('id', { mode: 'number'}).primaryKey(),
  watchlistId: bigint('watchlist_id', { mode: 'number'}),
  userId: bigint('user_id', { mode: 'number'}),
  movieId: bigint('movie_id', { mode: 'number'})
});

export type InsertWatchlist = typeof watchlistsTable.$inferInsert;
export type SelectWatchlist = typeof watchlistsTable.$inferSelect;

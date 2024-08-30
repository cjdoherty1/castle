import { bigserial, text } from 'drizzle-orm/pg-core';
import { castleSchema } from './castleSchema';

export const moviesTable = castleSchema.table('movies', {
  movieId: bigserial('movie_id', { mode: 'number'}).primaryKey(),
  title: text('title'),
  director: text('director')
});

export type InsertMovies = typeof moviesTable.$inferInsert;
export type SelectMovies = typeof moviesTable.$inferSelect;
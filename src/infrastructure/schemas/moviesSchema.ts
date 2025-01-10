import { bigserial, text, jsonb } from "drizzle-orm/pg-core";
import { castleSchema } from "./castleSchema";

export const moviesTable = castleSchema.table("movies", {
    movieId: bigserial("movie_id", { mode: "number" }).primaryKey(),
    title: text("title"),
    credits: jsonb("credits"),
    posterPath: text("poster_path"),
    genres: text("genres").array(),
    overview: text("overview"),
    rating: jsonb("rating")
});

export type InsertMovies = typeof moviesTable.$inferInsert;
export type SelectMovies = typeof moviesTable.$inferSelect;

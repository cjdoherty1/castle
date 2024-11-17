import { bigint, uuid, bigserial, real, text } from "drizzle-orm/pg-core";
import { castleSchema } from "./castleSchema";

export const movieReviewsTable = castleSchema.table("movie_reviews", {
    reviewId: uuid("review_id").primaryKey(),
    userId: uuid("user_id"),
    score: real("score"),
    review: text("movie_id"),
    movieId: bigint("movie_id", { mode: "number" }),
});

export type InsertMovieReview = typeof movieReviewsTable.$inferSelect;
export type SelectMovieReview = typeof movieReviewsTable.$inferSelect;

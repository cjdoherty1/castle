import { DatabaseError } from "../../business/Errors";
import { IMovieReviewRepository } from "../../business/movies/IMovieReviewRepository";
import { AddMovieReview, MovieReview } from "../../business/movies/MovieReview";
import { DatabaseAdapter } from "../DatabaseAdapter";
import { movieReviewsTable } from "../schemas/movieReviewsSchema";

export class MovieReviewRepository implements IMovieReviewRepository {
    private databaseAdapter: DatabaseAdapter;

    constructor(databaseAdapter: DatabaseAdapter) {
        this.databaseAdapter = databaseAdapter;
    }

    public async createMovieReview(addMovieReview: AddMovieReview): Promise<MovieReview> {
        try {
            console.info('Adding movie review to database');
            const newMovieReview = {
                userId: addMovieReview.userId,
                score: addMovieReview.score,
                review: addMovieReview.review,
                movieId: addMovieReview.movieId,
            };
            const drizzle = this.databaseAdapter.getClient();
            const createMovieReviewResponse = await drizzle
                .insert(movieReviewsTable)
                .values(newMovieReview)
                .returning({
                    reviewId: movieReviewsTable.reviewId,
                    score: movieReviewsTable.score,
                    review: movieReviewsTable.review,
                });
            
            const result = createMovieReviewResponse[0];
            const movieReview = new MovieReview(
                result.reviewId,
                result.score,
                result.review,
            )

            console.info('Added movie review to database');
            console.info({ movieReview: movieReview })
            return movieReview
        } catch (e) {
            throw new DatabaseError(e.message);
        }
    }
}
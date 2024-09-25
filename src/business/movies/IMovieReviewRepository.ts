import { AddMovieReview, MovieReview } from "./MovieReview";

export interface IMovieReviewRepository {
    createMovieReview(addMovieReview: AddMovieReview): Promise<MovieReview>;
}
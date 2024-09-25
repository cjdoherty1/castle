import { MovieReview } from "./MovieReview";

export class Movie {
    readonly movieId: number;
    readonly title: string;
    readonly director: string;
    readonly posterPath: string;
    readonly review?: MovieReview;

    constructor(movieId: number, title: string, director: string, posterPath: string, review?: MovieReview) {
        this.movieId = movieId;
        this.title = title;
        this.director = director;
        this.posterPath = posterPath;
        this.review = review;
    }
}

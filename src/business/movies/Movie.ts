import { MovieReview } from "./MovieReview";

export interface CastMember {
    name: string;
    profilePath: string;
    character: string;
    knownForDepartment: string;
}

export interface Director {
    name: string;
    profilePath: string;
}

export interface Credits {
    director: Director;
    cast: CastMember[];
}

export interface Rating {
    rating: number;
    ratingCount: number;
}

export class Movie {
    readonly movieId: number;
    readonly title: string;
    readonly credits: Credits;
    readonly posterPath: string;
    readonly genres: string[];
    readonly overview: string;
    readonly rating: Rating;
    readonly review?: MovieReview;

    constructor(
        movieId: number,
        title: string,
        credits: Credits,
        posterPath: string,
        genres: string[],
        overview: string,
        rating: Rating,
        review?: MovieReview
    ) {
        this.movieId = movieId;
        this.title = title;
        this.credits = credits;
        this.posterPath = posterPath;
        this.genres = genres;
        this.overview = overview;
        this.rating = rating;
        this.review = review;
    }
}

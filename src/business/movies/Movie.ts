export class Movie {
    readonly movieId: number;
    readonly title: string;
    readonly director: string;
    readonly posterPath: string;

    constructor(movieId: number, title: string, director: string, posterPath: string) {
        this.movieId = movieId;
        this.title = title;
        this.director = director;
        this.posterPath = posterPath;
    }
}

export class Movie {
    readonly movieId: number;
    readonly title: string;
    readonly director: string;
    readonly posterPath: string;

    constructor(id: number, title: string, director: string, posterPath: string) {
        this.movieId = id;
        this.title = title;
        this.director = director;
        this.posterPath = posterPath;
    }
}

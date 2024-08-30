export class Movie {
    readonly movieId: number;
    readonly title: string;
    readonly director: string;

    constructor(id: number, title: string, director: string) {
        this.movieId = id;
        this.title = title;
        this.director = director;
    }
}
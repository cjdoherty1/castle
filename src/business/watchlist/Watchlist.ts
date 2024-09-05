import { Movie } from "../movies/Movie";


export type WatchlistItem = {
    id: number;
    watchlistId: number;
    userId: number;
    movieId: number;
}

export class Watchlist {
    readonly watchlistId: number;
    readonly watchlistName: string;
    readonly movies: Movie[] = [];

    constructor(watchlistId: number, movies: object[]) {
        this.watchlistId = watchlistId;
        this.watchlistName = movies[0]['watchlistName'];

        for (let movie of movies) {
            let typedMovie = new Movie(movie['id'], movie['title'], movie['director']);
            this.movies.push(typedMovie);
        }
    }
}
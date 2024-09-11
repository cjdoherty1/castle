import { Movie } from "../movies/Movie";


export interface WatchlistItem {
    id: number;
    watchlistId: number;
    movieId: number;
}

export class Watchlist {
    readonly watchlistId: number;
    readonly watchlistName: string;
    readonly movies: Movie[] = [];

    constructor(watchlistId: number, watchlistName: string, movies: object[]) {
        this.watchlistId = watchlistId;
        this.watchlistName = watchlistName;

        for (let movie of movies) {
            let typedMovie = new Movie(movie['movieId'], movie['title'], movie['director']);
            this.movies.push(typedMovie);
        }
    }
}

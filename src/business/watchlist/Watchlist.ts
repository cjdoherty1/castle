import { Movie } from "../movies/Movie";

export interface WatchlistItemTableEntry {
    watchlistItemId: number;
    watchlistId: number;
    movieId: number;
}

export class WatchlistItem {
    readonly watchlistItemId: number;
    readonly movie: Movie;

    constructor(watchlistItemId: number, movie: Movie) {
        this.watchlistItemId = watchlistItemId;
        this.movie = movie;
    }
}

export class Watchlist {
    readonly watchlistId: number;
    readonly watchlistName: string;
    readonly watchlistItems: WatchlistItem[] = [];

    constructor(
        watchlistId: number,
        watchlistName: string,
        watchlistItems?: WatchlistItem[]
    ) {
        this.watchlistId = watchlistId;
        this.watchlistName = watchlistName;
        if (typeof watchlistItems !== undefined) {
            this.watchlistItems = watchlistItems;
        }
    }
}

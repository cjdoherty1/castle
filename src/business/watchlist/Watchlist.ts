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
    readonly isWatchedList: boolean;
    readonly watchlistItems: WatchlistItem[] = [];

    constructor(
        watchlistId: number,
        watchlistName: string,
        isWatchedList: boolean,
        watchlistItems?: WatchlistItem[]
    ) {
        this.watchlistId = watchlistId;
        this.watchlistName = watchlistName;
        this.isWatchedList = isWatchedList;
        if (typeof watchlistItems !== undefined) {
            this.watchlistItems = watchlistItems;
        }
    }
}

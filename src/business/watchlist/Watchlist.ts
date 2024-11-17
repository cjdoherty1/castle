import { Movie } from "../movies/Movie";

export interface WatchlistItemTableEntry {
    watchlistItemId: string;
    watchlistId: string;
    movieId: number;
}

export class WatchlistItem {
    readonly watchlistItemId: string;
    readonly movie: Movie;

    constructor(watchlistItemId: string, movie: Movie) {
        this.watchlistItemId = watchlistItemId;
        this.movie = movie;
    }
}

export class Watchlist {
    readonly watchlistId: string;
    readonly watchlistName: string;
    readonly isWatchedList: boolean;
    readonly watchlistItems: WatchlistItem[] = [];

    constructor(
        watchlistId: string,
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

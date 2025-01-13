import { Watchlist, WatchlistItemTableEntry } from "./Watchlist";
import { Movie } from "../movies/Movie";

export interface IWatchlistRepository {
    getAllWatchlists(userId: string): Promise<Watchlist[]>;

    getWatchlistByWatchlistId(watchlistId: string, userId: string): Promise<Watchlist>;

    addWatchlistItem(watchlistId: string, movieId: number, userId: string, watchlistItemId: string): Promise<Movie>;

    createWatchlist(watchlistName: string, userId: string, isWatchedList: boolean, watchlistId: string): Promise<Watchlist>;

    deleteWatchlistItem(watchlistItemId: string, userId: string): Promise<WatchlistItemTableEntry>;

    deleteWatchlist(watchlistId: string, userId: string): Promise<Watchlist>;
}
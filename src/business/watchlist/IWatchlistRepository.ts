import { Watchlist, WatchlistItemTableEntry } from "./Watchlist";

export interface IWatchlistRepository {
    getAllWatchlists(userId: string): Promise<Watchlist[]>;

    getWatchlistByWatchlistId(watchlistId: number, userId: string): Promise<Watchlist>;

    addWatchlistItem(watchlistId: number, movieId: number, userId: string): Promise<WatchlistItemTableEntry>;

    createWatchlist(watchlistName: string, userId: string): Promise<Watchlist>;

    deleteWatchlistItem(watchlistItemId: number, userId: string): Promise<WatchlistItemTableEntry>;

    deleteWatchlist(watchlistId: number, userId: string): Promise<Watchlist>;
}
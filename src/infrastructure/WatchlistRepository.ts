import { max, eq, and } from "drizzle-orm";
import {
    InsertWatchlist,
    SelectWatchlist,
    watchlistsTable,
} from "./schemas/watchlistsSchema";
import {
    InsertWatchlistItem,
    SelectWatchlistItem,
    watchlistItemsTable,
} from "./schemas/watchlistItemsSchema";
import { moviesTable } from "./schemas/moviesSchema";
import { DatabaseAdapter } from "./DatabaseAdapter";
import { Watchlist } from "../business/watchlist/Watchlist";
import { NotFoundError } from "../business/Errors";

// --- MAKE USER ID A GLOBAL VARIABLE ---

export class WatchlistRepository {
    private databaseAdapter;

    constructor(databaseAdapter: DatabaseAdapter) {
        this.databaseAdapter = databaseAdapter;
    }

    async getWatchlistByWatchListId(
        id: SelectWatchlist["id"],
        userId: string
    ): Promise<Watchlist> {
        const drizzle = this.databaseAdapter.getClient();
        const watchlistNameResponse = await drizzle
            .select({
                watchlistName: watchlistsTable.watchlistName,
            })
            .from(watchlistsTable)
            .where(
                and(eq(watchlistsTable.id, id), eq(watchlistsTable.userId, userId))
            );

        if (watchlistNameResponse.length == 0) {
            throw new NotFoundError("This watchlist cannot be found.");
        }

        let watchlistName = watchlistNameResponse[0].watchlistName;

        const moviesResponse = await this.databaseAdapter
            .getClient()
            .select({
                movieId: moviesTable.movieId,
                title: moviesTable.title,
                director: moviesTable.director,
            })
            .from(watchlistItemsTable)
            .innerJoin(
                moviesTable,
                eq(watchlistItemsTable.movieId, moviesTable.movieId)
            )
            .where(eq(watchlistItemsTable.watchlistId, id));

        let watchlist = new Watchlist(id, watchlistName, moviesResponse);
        return watchlist;
    }

    async addWatchlistItem(watchlistId: number, movieId: number) {
        let newWatchlistItem: InsertWatchlist;
        let maxId = await this.databaseAdapter
            .getClient()
            .select({ max: max(watchlistItemsTable.id) })
            .from(watchlistItemsTable);
        let newId = maxId[0].max + 1;
        newWatchlistItem = {
            id: newId,
            watchlistId: watchlistId,
            movieId: movieId,
        };
        await this.databaseAdapter
            .getClient()
            .insert(watchlistItemsTable)
            .values(newWatchlistItem);
    }

    async createWatchlist(userId: string, watchlistName: string) {
        let newWatchlist: InsertWatchlist;
        let maxId = await this.databaseAdapter
            .getClient()
            .select({ max: max(watchlistsTable.id) })
            .from(watchlistsTable);
        let newId = maxId[0].max + 1;
        newWatchlist = {
            id: newId,
            userId: userId,
            watchlistName: watchlistName,
        };
        await this.databaseAdapter
            .getClient()
            .insert(watchlistsTable)
            .values(newWatchlist);
    }

    //REMOVE MOVIE

    //DELETE WATCHLIST (no flag)
}

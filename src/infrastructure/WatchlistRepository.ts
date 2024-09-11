import { max, eq, and, sql } from "drizzle-orm";
import { InsertWatchlist, watchlistsTable } from "./schemas/watchlistsSchema";
import { watchlistItemsTable } from "./schemas/watchlistItemsSchema";
import { moviesTable } from "./schemas/moviesSchema";
import { DatabaseAdapter } from "./DatabaseAdapter";
import { Watchlist, WatchlistItem } from "../business/watchlist/Watchlist";
import { NotFoundError, DatabaseError } from "../business/Errors";

// --- MAKE USER ID A GLOBAL VARIABLE ---

export class WatchlistRepository {
    private databaseAdapter;

    constructor(databaseAdapter: DatabaseAdapter) {
        this.databaseAdapter = databaseAdapter;
    }

    async getWatchlistByWatchListId(
        id: number,
        userId: string
    ): Promise<Watchlist> {
        const drizzle = this.databaseAdapter.getClient();
        const watchlistNameResponse = await drizzle
            .select({
                watchlistName: watchlistsTable.watchlistName,
            })
            .from(watchlistsTable)
            .where(
                and(
                    eq(watchlistsTable.id, id),
                    eq(watchlistsTable.userId, userId)
                )
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

    async addWatchlistItem(
        watchlistId: number,
        movieId: number,
        userId: string
    ) {
        try {
            const drizzle = this.databaseAdapter.getClient();
            const insertResponse =
                await drizzle.execute(sql`insert into ${watchlistItemsTable} (watchlist_id, movie_id)
                                  select w.id, m.movie_id
                                  from ${watchlistsTable} w, ${moviesTable} m
                                  where w.id = ${watchlistId} 
                                  and m.movie_id = ${movieId} 
                                  and w.user_id = ${userId}
                                  returning ${watchlistItemsTable}.id, ${watchlistItemsTable}.watchlist_id, ${watchlistItemsTable}.movie_id`);
            if (insertResponse.length == 0) {
                throw new NotFoundError(
                    "This watchlist or movie cannot be found."
                );
            }
            const watchlistItem: WatchlistItem = {
                id: insertResponse[0].id,
                watchlistId: insertResponse[0].watchlist_id,
                movieId: insertResponse[0].movie_id,
            };

            return watchlistItem;
        } catch (e) {
            if (e instanceof NotFoundError) {
                throw e;
            } else {
                throw new DatabaseError(e.message);
            }
        }
    }

    async createWatchlist(userId: string, watchlistName: string) {
        try {
            const newWatchlist = {
                userId: userId,
                watchlistName: watchlistName,
            };
            await this.databaseAdapter
                .getClient()
                .insert(watchlistsTable)
                .values(newWatchlist);
        } catch (e) {
            throw new DatabaseError(e.message);
        }
    }

    //REMOVE MOVIE

    //DELETE WATCHLIST (no flag)
}

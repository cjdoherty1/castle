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
        console.log("Getting watchlist from database");
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

        console.log("Retrieved watchlist name from database");

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
        console.log("Retrieved watchlist from database:");
        console.log(watchlist);
        return watchlist;
    }

    async addWatchlistItem(
        watchlistId: number,
        movieId: number,
        userId: string
    ) {
        try {
            console.log("Adding watchlist item to database");
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

            console.log("Added watchlist item to database:");
            console.log(watchlistItem);

            return watchlistItem;
        } catch (e) {
            if (e instanceof NotFoundError) {
                throw e;
            } else {
                throw new DatabaseError(e.message);
            }
        }
    }

    async createWatchlist(watchlistName: string, userId: string) {
        try {
            console.log("Adding watchlist to database");
            const newWatchlist = {
                userId: userId,
                watchlistName: watchlistName,
            };
            await this.databaseAdapter
                .getClient()
                .insert(watchlistsTable)
                .values(newWatchlist);
            console.log("Created watchlist");
        } catch (e) {
            throw new DatabaseError(e.message);
        }
    }

    async deleteWatchlistItem(watchlistItemId: number, userId: string) {
        try {
            console.log("Deleting watchlist item from database");
            const drizzle = this.databaseAdapter.getClient();
            const deleteResponse =
            await drizzle.execute(sql`delete from ${watchlistItemsTable} wi
                                      using ${watchlistsTable} w
                                      where wi.id = ${watchlistItemId}
                                      and wi.watchlist_id = w.id
                                      and w.user_id = ${userId}
                                      returning wi.id, wi.watchlist_id, wi.movie_id`);
            if (deleteResponse.length == 0) {
                throw new NotFoundError(
                    "This watchlist or movie cannot be found."
                );
            }
            const watchlistItem: WatchlistItem = {
                id: deleteResponse[0].id,
                watchlistId: deleteResponse[0].watchlist_id,
                movieId: deleteResponse[0].movie_id,
            };

            console.log("Deleted watchlist item from database:");
            console.log(watchlistItem);

            return watchlistItem;
        } catch (e) {
            if (e instanceof NotFoundError) {
                throw e;
            } else {
                throw new DatabaseError(e.message);
            }
        }
    }

    async deleteWatchlist(watchlistId: string, userId: string) {
        try {
            console.log("Deleting watchlist from database");
            const drizzle = this.databaseAdapter.getClient();
            const deleteResponse = await drizzle.transaction(async (tx) => {
                await drizzle.execute(sql`delete from castle.watchlist_items wi
                                          using castle.watchlists w
                                          where wi.watchlist_id = ${watchlistId}
                                          and wi.watchlist_id = w.id
                                          and w.user_id = ${userId};`);
                return await drizzle.execute(sql`delete from castle.watchlists w
                                          where w.id = ${watchlistId}
                                          and w.user_id = ${userId}
                                          returning w.id, w.user_id, w.watchlist_name;`);
            });
            if (deleteResponse.length == 0) {
                throw new NotFoundError(
                    "This watchlist cannot be found."
                );
            }
            let watchlist = new Watchlist(deleteResponse[0].id, deleteResponse[0].watchlist_name, []);  
            console.log("Deleted watchlist from database:");
            console.log(watchlist);  
            return watchlist;
        } catch (e) {
            if (e instanceof NotFoundError) {
                throw e;
            } else {
                throw new DatabaseError(e.message);
            }
        }
    }
}

import { eq, and, sql } from "drizzle-orm";
import { watchlistsTable } from "../schemas/watchlistsSchema";
import { watchlistItemsTable } from "../schemas/watchlistItemsSchema";
import { moviesTable } from "../schemas/moviesSchema";
import { DatabaseAdapter } from "../DatabaseAdapter";
import {
    Watchlist,
    WatchlistItem,
    WatchlistItemTableEntry,
} from "../../business/watchlist/Watchlist";
import { Movie } from "../../business/movies/Movie";
import { NotFoundError, DatabaseError } from "../../business/Errors";
import { MovieApiAdapter } from "../movies/MovieApiAdapter";

export class WatchlistRepository {
    private databaseAdapter: DatabaseAdapter;
    private movieApiAdapter: MovieApiAdapter;

    constructor(databaseAdapter: DatabaseAdapter, movieApiAdapter: MovieApiAdapter) {
        this.databaseAdapter = databaseAdapter;
        this.movieApiAdapter = movieApiAdapter;
    }

    async getWatchlistByWatchListId(
        id: number,
        userId: string
    ): Promise<Watchlist> {
        console.log("Getting watchlist from database");
        const drizzle = this.databaseAdapter.getClient();
        const watchlistNameResponse = await drizzle
            .select({
                watchlistId: watchlistsTable.id,
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
        let watchlistId = watchlistNameResponse[0].watchlistId;

        const watchlistItemsResponse = await this.databaseAdapter
            .getClient()
            .select({
                watchlistItemId: watchlistItemsTable.id,
                movieId: moviesTable.movieId,
                title: moviesTable.title,
                director: moviesTable.director,
                posterPath: moviesTable.posterPath
            })
            .from(watchlistItemsTable)
            .innerJoin(
                moviesTable,
                eq(watchlistItemsTable.movieId, moviesTable.movieId)
            )
            .where(eq(watchlistItemsTable.watchlistId, id));

        let watchlist;
        if (watchlistItemsResponse.length === 0) {
            watchlist = new Watchlist(watchlistId, watchlistName);
        } else {
            let watchlistItems = [];
            let movie;
            for (let watchlistItemResponse of watchlistItemsResponse) {
                movie = new Movie(
                    watchlistItemResponse.movieId,
                    watchlistItemResponse.title,
                    watchlistItemResponse.director,
                    watchlistItemResponse.poster_path
                );
                watchlistItems.push(
                    new WatchlistItem(
                        watchlistItemResponse.watchlistItemId,
                        movie
                    )
                );
            }
            watchlist = new Watchlist(
                watchlistId,
                watchlistName,
                watchlistItems
            );
        }

        console.log("Retrieved watchlist from database:");
        console.log(watchlist);
        return watchlist;
    }

    async addWatchlistItem(
        watchlistId: number,
        movieId: number,
        userId: string
    ): Promise<WatchlistItemTableEntry> {
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
            const watchlistItemTableEntry: WatchlistItemTableEntry = {
                watchlistItemId: insertResponse[0].id,
                watchlistId: insertResponse[0].watchlist_id,
                movieId: insertResponse[0].movie_id,
            };

            console.log("Added watchlist item to database:");
            console.log(watchlistItemTableEntry);

            return watchlistItemTableEntry;
        } catch (e) {
            if (e instanceof NotFoundError) {
                throw e;
            } else {
                throw new DatabaseError(e.message);
            }
        }
    }

    async createWatchlist(
        watchlistName: string,
        userId: string
    ): Promise<Watchlist> {
        try {
            console.log("Adding watchlist to database");
            const newWatchlist = {
                userId: userId,
                watchlistName: watchlistName,
            };
            const createResponse = await this.databaseAdapter
                .getClient()
                .insert(watchlistsTable)
                .values(newWatchlist)
                .returning({
                    watchlistId: watchlistsTable.id,
                    userId: watchlistsTable.userId,
                    watchlistName: watchlistsTable.watchlistName,
                });

            const watchlist = new Watchlist(
                createResponse[0].watchlistId,
                createResponse[0].watchlistName
            );
            console.log("Added watchlist to database:");
            console.log(watchlist);
            return watchlist;
        } catch (e) {
            throw new DatabaseError(e.message);
        }
    }

    async deleteWatchlistItem(
        watchlistItemId: number,
        userId: string
    ): Promise<WatchlistItemTableEntry> {
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
            const watchlistItemTableEntry: WatchlistItemTableEntry = {
                watchlistItemId: deleteResponse[0].id,
                watchlistId: deleteResponse[0].watchlist_id,
                movieId: deleteResponse[0].movie_id,
            };

            console.log("Deleted watchlist item from database:");
            console.log(watchlistItemTableEntry);

            return watchlistItemTableEntry;
        } catch (e) {
            if (e instanceof NotFoundError) {
                throw e;
            } else {
                throw new DatabaseError(e.message);
            }
        }
    }

    async deleteWatchlist(
        watchlistId: string,
        userId: string
    ): Promise<Watchlist> {
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
                throw new NotFoundError("This watchlist cannot be found.");
            }
            let watchlist = new Watchlist(
                deleteResponse[0].id,
                deleteResponse[0].watchlist_name
            );
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

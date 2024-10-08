import { eq, and, sql } from "drizzle-orm";
import { watchlistsTable } from "../schemas/watchlistsSchema";
import {
    InsertWatchlistItem,
    watchlistItemsTable,
} from "../schemas/watchlistItemsSchema";
import { moviesTable } from "../schemas/moviesSchema";
import { DatabaseAdapter } from "../DatabaseAdapter";
import {
    Watchlist,
    WatchlistItem,
    WatchlistItemTableEntry,
} from "../../business/watchlist/Watchlist";
import { Movie } from "../../business/movies/Movie";
import { NotFoundError, DatabaseError } from "../../business/Errors";
import { MovieRepository } from "./MovieRepository";
import { IWatchlistRepository } from "../../business/watchlist/IWatchlistRepository";
import { movieReviewsTable } from "../schemas/movieReviewsSchema";
import { MovieReview } from "../../business/movies/MovieReview";

export interface GetAllWatchlistsResult {
    watchlists: Watchlist[]
    watchedLists: Watchlist[]
}

export class WatchlistRepository implements IWatchlistRepository {
    private databaseAdapter: DatabaseAdapter;
    private movieRepository: MovieRepository;

    constructor(
        databaseAdapter: DatabaseAdapter,
        movieRepository: MovieRepository
    ) {
        this.databaseAdapter = databaseAdapter;
        this.movieRepository = movieRepository;
    }

    async getAllWatchlists(userId: string): Promise<Watchlist[]> {
        try {
            console.info("Getting all watchlists from database");
            console.info({ user: userId });
            const drizzle = this.databaseAdapter.getClient();

            const watchlistsResponse = await drizzle
                .select({
                    watchlistId: watchlistsTable.watchlistId,
                    watchlistName: watchlistsTable.watchlistName,
                })
                .from(watchlistsTable)
                .where(eq(watchlistsTable.userId, userId));

            if (watchlistsResponse.length === 0) {
                console.warn('No watchlists found for this user');
                console.info({ watchlistResponse: watchlistsResponse })
                return [];
            }

            const watchlists = this.buildWatchlists(watchlistsResponse);

            const allWatchlistsResponse = await drizzle
                .select({
                    watchlistId: watchlistItemsTable.watchlistId,
                    watchlistName: watchlistsTable.watchlistName,
                    watchlistItemId: watchlistItemsTable.watchlistItemId,
                    movieId: moviesTable.movieId,
                    title: moviesTable.title,
                    director: moviesTable.director,
                    posterPath: moviesTable.posterPath,
                    isWatchedList: watchlistsTable.isWatchedList
                })
                .from(watchlistItemsTable)
                .innerJoin(
                    watchlistsTable,
                    eq(
                        watchlistItemsTable.watchlistId,
                        watchlistsTable.watchlistId
                    )
                )
                .innerJoin(
                    moviesTable,
                    eq(watchlistItemsTable.movieId, moviesTable.movieId)
                )
                .where(eq(watchlistsTable.userId, userId));

            const allWatchlists = await allWatchlistsResponse.reduce(async (result, bigWatchlistItem) => {
                let watchlist: Watchlist = result.find(w => w.watchlistId === bigWatchlistItem.watchlistId);
                let movie = await this.buildMovie(bigWatchlistItem, userId);
                let watchlistItem = new WatchlistItem(bigWatchlistItem.watchlistItemId, movie)

                if (watchlist) {
                    watchlist.watchlistItems.push(watchlistItem);
                } else {
                    result.push(new Watchlist(bigWatchlistItem.watchlistId, bigWatchlistItem.watchlistName, [watchlistItem]));
                }

                return result;
            }, watchlists);

            return allWatchlists;
        } catch (e) {
            if (e instanceof NotFoundError) {
                throw e;
            } else {
                throw new DatabaseError(e.message);
            }
        }
    }

    private buildWatchlists(watchlistsResponse): Watchlist[] {
        return watchlistsResponse.map((watchlistResponse) => new Watchlist(watchlistResponse.watchlistId, watchlistResponse.watchlistName, []));
    }

    private async buildMovie(bigWatchlistItem, userId: string): Promise<Movie> {
        const baseMovie = new Movie(bigWatchlistItem.movieId, bigWatchlistItem.title, bigWatchlistItem.director, bigWatchlistItem.posterPath);
        if (bigWatchlistItem.isWatchedList) {
            console.info('Retrieving movie review from database');

            const drizzle = this.databaseAdapter.getClient();
            const movieReviewResult = await drizzle.select({
                reviewId: movieReviewsTable.reviewId,
                score: movieReviewsTable.score,
                review: movieReviewsTable.review,
            })
            .from(movieReviewsTable)
            .where(and(
                eq(movieReviewsTable.userId, userId),
                eq(movieReviewsTable.movieId, bigWatchlistItem.movieId)
            ))

            if (movieReviewResult.length == 0) {
                console.warn('No review found for this movie in a watched list');
                return baseMovie;
            }

            console.info('Retrieved movie review from database');

            const result = movieReviewResult[0];
            const movieReview = new MovieReview(result.reviewId, result.score, result.review);

            return new Movie(bigWatchlistItem.movieId, bigWatchlistItem.title, bigWatchlistItem.director, bigWatchlistItem.posterPath, movieReview);
        }

        return baseMovie;
    }

    async getWatchlistByWatchlistId(
        watchlistId: number,
        userId: string
    ): Promise<Watchlist> {
        console.log("Getting watchlist from database");
        const drizzle = this.databaseAdapter.getClient();
        const watchlistNameResponse = await drizzle
            .select({
                watchlistId: watchlistsTable.watchlistId,
                watchlistName: watchlistsTable.watchlistName,
            })
            .from(watchlistsTable)
            .where(
                and(
                    eq(watchlistsTable.watchlistId, watchlistId),
                    eq(watchlistsTable.userId, userId)
                )
            );

        if (watchlistNameResponse.length == 0) {
            throw new NotFoundError("This watchlist cannot be found.");
        }

        console.log("Retrieved watchlist name from database");

        let watchlistName = watchlistNameResponse[0].watchlistName;

        const watchlistItemsResponse = await this.databaseAdapter
            .getClient()
            .select({
                watchlistItemId: watchlistItemsTable.watchlistItemId,
                movieId: moviesTable.movieId,
                title: moviesTable.title,
                director: moviesTable.director,
                posterPath: moviesTable.posterPath,
            })
            .from(watchlistItemsTable)
            .innerJoin(
                moviesTable,
                eq(watchlistItemsTable.movieId, moviesTable.movieId)
            )
            .where(eq(watchlistItemsTable.watchlistId, watchlistId));

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
                    watchlistItemResponse.posterPath
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
                                  select w.watchlist_id, m.movie_id
                                  from ${watchlistsTable} w, ${moviesTable} m
                                  where w.watchlist_id = ${watchlistId} 
                                  and m.movie_id = ${movieId} 
                                  and w.user_id = ${userId}
                                  returning ${watchlistItemsTable}.watchlist_item_id, ${watchlistItemsTable}.watchlist_id, ${watchlistItemsTable}.movie_id`);

            let watchlistItemTableEntry: WatchlistItemTableEntry;
            if (insertResponse.length === 0) {
                console.info("Either movie or watchlist does not exist");
                console.info(
                    "Checking if a watchlist exists for your user with id: " +
                        watchlistId
                );
                const watchlistResponse = await drizzle
                    .select({
                        watchlistId: watchlistsTable.watchlistId,
                    })
                    .from(watchlistsTable)
                    .where(
                        and(
                            eq(watchlistsTable.watchlistId, watchlistId),
                            eq(watchlistsTable.userId, userId)
                        )
                    );
                if (watchlistResponse.length === 0) {
                    throw new NotFoundError("Watchlist could not be found");
                } else {
                    console.info(
                        "Watchlist exists, adding movie to database with id: " +
                            movieId
                    );
                    const newMovie = await this.movieRepository.addMovie(
                        movieId
                    );
                    console.info("Added new movie to database:");
                    console.info(newMovie);
                    const insertWatchlistItem = await drizzle
                        .insert(watchlistItemsTable)
                        .values({
                            watchlistId: watchlistId,
                            movieId: movieId,
                        })
                        .returning({
                            id: watchlistItemsTable.watchlistItemId,
                            watchlistId: watchlistItemsTable.watchlistId,
                            movieId: watchlistItemsTable.movieId,
                        });
                    watchlistItemTableEntry = {
                        watchlistItemId: insertWatchlistItem[0].id,
                        watchlistId: insertWatchlistItem[0].watchlistId,
                        movieId: insertWatchlistItem[0].movieId,
                    };
                }
            } else {
                watchlistItemTableEntry = {
                    watchlistItemId: insertResponse[0].id,
                    watchlistId: insertResponse[0].watchlist_id,
                    movieId: insertResponse[0].movie_id,
                };
            }

            console.info("Added watchlist item to database:");
            console.info(watchlistItemTableEntry);

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
        userId: string,
        isWatchedList: boolean = false,
    ): Promise<Watchlist> {
        try {
            console.log("Adding watchlist to database");
            const newWatchlist = {
                userId: userId,
                watchlistName: watchlistName,
                isWatchedList: isWatchedList,
            };
            const createResponse = await this.databaseAdapter
                .getClient()
                .insert(watchlistsTable)
                .values(newWatchlist)
                .returning({
                    watchlistId: watchlistsTable.watchlistId,
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
        watchlistId: number,
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

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
    watchlists: Watchlist[];
    watchedLists: Watchlist[];
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
                    isWatchedList: watchlistsTable.isWatchedList,
                })
                .from(watchlistsTable)
                .where(eq(watchlistsTable.userId, userId));

            if (watchlistsResponse.length === 0) {
                console.warn("No watchlists found for this user");
                console.info({ watchlistResponse: watchlistsResponse });
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
                    credits: moviesTable.credits,
                    posterPath: moviesTable.posterPath,
                    genres: moviesTable.genres,
                    overview: moviesTable.overview,
                    rating: moviesTable.rating,
                    isWatchedList: watchlistsTable.isWatchedList,
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

            const allWatchlists = allWatchlistsResponse.reduce(
                (result, bigWatchlistItem) => {
                    let watchlist: Watchlist = result.find(
                        (w) => w.watchlistId === bigWatchlistItem.watchlistId
                    );
                    let movie = new Movie(
                        bigWatchlistItem.movieId,
                        bigWatchlistItem.title,
                        bigWatchlistItem.credits,
                        bigWatchlistItem.posterPath,
                        bigWatchlistItem.genres,
                        bigWatchlistItem.overview,
                        bigWatchlistItem.rating
                    );
                    let watchlistItem = new WatchlistItem(
                        bigWatchlistItem.watchlistItemId,
                        movie
                    );

                    if (watchlist) {
                        watchlist.watchlistItems.push(watchlistItem);
                    } else {
                        result.push(
                            new Watchlist(
                                bigWatchlistItem.watchlistId,
                                bigWatchlistItem.watchlistName,
                                bigWatchlistItem.isWatchedList,
                                [watchlistItem]
                            )
                        );
                    }

                    return result;
                },
                watchlists
            );

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
        return watchlistsResponse.map(
            (watchlistResponse) =>
                new Watchlist(
                    watchlistResponse.watchlistId,
                    watchlistResponse.watchlistName,
                    watchlistResponse.isWatchedList,
                    []
                )
        );
    }

    private async buildMovie(bigWatchlistItem, userId: string): Promise<Movie> {
        const baseMovie = new Movie(
            bigWatchlistItem.movieId,
            bigWatchlistItem.title,
            bigWatchlistItem.credits,
            bigWatchlistItem.posterPath,
            bigWatchlistItem.genres,
            bigWatchlistItem.overview,
            bigWatchlistItem.rating
        );
        if (bigWatchlistItem.isWatchedList) {
            console.info("Retrieving movie review from database");

            const drizzle = this.databaseAdapter.getClient();
            const movieReviewResult = await drizzle
                .select({
                    reviewId: movieReviewsTable.reviewId,
                    score: movieReviewsTable.score,
                    review: movieReviewsTable.review,
                })
                .from(movieReviewsTable)
                .where(
                    and(
                        eq(movieReviewsTable.userId, userId),
                        eq(movieReviewsTable.movieId, bigWatchlistItem.movieId)
                    )
                );

            if (movieReviewResult.length == 0) {
                console.warn(
                    "No review found for this movie in a watched list"
                );
                return baseMovie;
            }

            console.info("Retrieved movie review from database");

            const result = movieReviewResult[0];
            const movieReview = new MovieReview(
                result.reviewId,
                result.score,
                result.review
            );

            return new Movie(
                bigWatchlistItem.movieId,
                bigWatchlistItem.title,
                bigWatchlistItem.credits,
                bigWatchlistItem.posterPath,
                bigWatchlistItem.genres,
                bigWatchlistItem.overview,
                bigWatchlistItem.rating,
                movieReview
            );
        }

        return baseMovie;
    }

    async getWatchlistByWatchlistId(
        watchlistId: string,
        userId: string
    ): Promise<Watchlist> {
        console.log("Getting watchlist from database");
        const drizzle = this.databaseAdapter.getClient();
        const watchlistNameResponse = await drizzle
            .select({
                watchlistId: watchlistsTable.watchlistId,
                watchlistName: watchlistsTable.watchlistName,
                isWatchedList: watchlistsTable.isWatchedList,
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
        let isWatchedList = watchlistNameResponse[0].isWatchedList;

        const watchlistItemsResponse = await this.databaseAdapter
            .getClient()
            .select({
                watchlistItemId: watchlistItemsTable.watchlistItemId,
                movieId: moviesTable.movieId,
                title: moviesTable.title,
                credits: moviesTable.credits,
                posterPath: moviesTable.posterPath,
                genres: moviesTable.genres,
                overview: moviesTable.overview,
                rating: moviesTable.rating,
            })
            .from(watchlistItemsTable)
            .innerJoin(
                moviesTable,
                eq(watchlistItemsTable.movieId, moviesTable.movieId)
            )
            .where(eq(watchlistItemsTable.watchlistId, watchlistId));

        let watchlist;
        if (watchlistItemsResponse.length === 0) {
            watchlist = new Watchlist(
                watchlistId,
                watchlistName,
                isWatchedList
            );
        } else {
            let watchlistItems = [];
            let movie;
            for (let watchlistItemResponse of watchlistItemsResponse) {
                movie = new Movie(
                    watchlistItemResponse.movieId,
                    watchlistItemResponse.title,
                    watchlistItemResponse.credits,
                    watchlistItemResponse.posterPath,
                    watchlistItemResponse.genres,
                    watchlistItemResponse.overview,
                    watchlistItemResponse.rating
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
                isWatchedList,
                watchlistItems
            );
        }

        console.log("Retrieved watchlist from database:");
        console.log(watchlist);
        return watchlist;
    }

    async addWatchlistItem(
        watchlistId: string,
        movieId: number,
        userId: string,
        watchlistItemId: string
    ): Promise<Movie> {
        try {
            console.log("Adding watchlist item to database");
            const drizzle = this.databaseAdapter.getClient();
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
            }

            const movieResponse = await drizzle
                .select({
                    movieId: moviesTable.movieId,
                    title: moviesTable.title,
                    credits: moviesTable.credits,
                    posterPath: moviesTable.posterPath,
                    genres: moviesTable.genres,
                    overview: moviesTable.overview,
                    rating: moviesTable.rating,
                })
                .from(moviesTable)
                .where(eq(moviesTable.movieId, movieId));

            let newMovie: Movie;

            if (movieResponse.length === 0) {
                console.info(
                    "Watchlist exists, but movie does not, adding movie to database with id: " +
                        movieId
                );
                newMovie = await this.movieRepository.addMovie(
                    movieId
                );
                console.info("Added new movie to database:");
                console.info(newMovie);
            } else {
                newMovie = new Movie(
                    movieResponse[0].movieId,
                    movieResponse[0].title,
                    movieResponse[0].credits,
                    movieResponse[0].posterPath,
                    movieResponse[0].genres,
                    movieResponse[0].overview,
                    movieResponse[0].rating
                );
            }
            const insertWatchlistItem = await drizzle
                .insert(watchlistItemsTable)
                .values({
                    watchlistId: watchlistId,
                    movieId: movieId,
                    watchlistItemId: watchlistItemId,
                })

            return newMovie;
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
        watchlistId: string
    ): Promise<Watchlist> {
        try {
            console.log("Adding watchlist to database");
            const newWatchlist = {
                userId: userId,
                watchlistName: watchlistName,
                isWatchedList: isWatchedList,
                watchlistId: watchlistId,
            };
            const createResponse = await this.databaseAdapter
                .getClient()
                .insert(watchlistsTable)
                .values(newWatchlist)
                .returning({
                    watchlistId: watchlistsTable.watchlistId,
                    watchlistName: watchlistsTable.watchlistName,
                    isWatchedList: watchlistsTable.isWatchedList,
                });

            const watchlist = new Watchlist(
                createResponse[0].watchlistId,
                createResponse[0].watchlistName,
                createResponse[0].isWatchedList
            );
            console.log("Added watchlist to database:");
            console.log(watchlist);
            return watchlist;
        } catch (e) {
            throw new DatabaseError(e.message);
        }
    }

    async deleteWatchlistItem(
        watchlistItemId: string,
        userId: string
    ): Promise<WatchlistItemTableEntry> {
        try {
            console.log("Deleting watchlist item from database");
            const drizzle = this.databaseAdapter.getClient();
            const deleteResponse =
                await drizzle.execute(sql`delete from ${watchlistItemsTable} wi
                                      using ${watchlistsTable} w
                                      where wi.watchlist_item_id = ${watchlistItemId}
                                      and wi.watchlist_id = w.watchlist_id
                                      and w.user_id = ${userId}
                                      returning wi.watchlist_item_id, wi.watchlist_id, wi.movie_id`);
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
                                          and wi.watchlist_id = w.watchlist_id
                                          and w.user_id = ${userId};`);
                return await drizzle.execute(sql`delete from castle.watchlists w
                                          where w.watchlist_id = ${watchlistId}
                                          and w.user_id = ${userId}
                                          returning w.watchlist_id, w.user_id, w.watchlist_name, w.is_watched_list;`);
            });
            if (deleteResponse.length == 0) {
                throw new NotFoundError("This watchlist cannot be found.");
            }
            let watchlist = new Watchlist(
                deleteResponse[0].id,
                deleteResponse[0].watchlist_name,
                deleteResponse[0].is_watched_list
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

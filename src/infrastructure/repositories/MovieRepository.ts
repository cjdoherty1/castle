import { DatabaseAdapter } from "../DatabaseAdapter";
import { Movie } from "../../business/movies/Movie";
import { IMovieRepository } from "../../business/movies/IMovieRepository";
import { MovieApiAdapter } from "../movies/MovieApiAdapter";
import {
    MovieSearchResult,
    MultiMediaSearchResult,
    PersonSearchResult,
} from "../../business/movies/SearchResult";
import { moviesTable } from "../schemas/moviesSchema";
import { eq } from "drizzle-orm";
import { NotFoundError } from "../../business/Errors";

export class MovieRepository implements IMovieRepository {
    private databaseAdapter;
    private movieApiAdapter: MovieApiAdapter;

    constructor(
        databaseAdapter: DatabaseAdapter,
        movieApiAdapter: MovieApiAdapter
    ) {
        this.databaseAdapter = databaseAdapter;
        this.movieApiAdapter = movieApiAdapter;
    }

    async searchMovie(
        searchQuery: string,
        pageNumber: number
    ): Promise<MovieSearchResult[]> {
        try {
            console.info("Searching TMDB for movies with search query: " + searchQuery);
            const multiSearchResults =
                await this.movieApiAdapter.searchMultiMedia({
                    searchQuery: searchQuery,
                    page: pageNumber,
                });

            const movieSearchResults = multiSearchResults.map((searchResult) =>
                this.convertToMovieSearchResult(searchResult)
            );
            const flattenedMovieSearchResults = movieSearchResults.flat();

            console.info("Retrieved search results:");
            console.info(flattenedMovieSearchResults);
            return flattenedMovieSearchResults;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async getMovieById(movieId: number): Promise<Movie> {
        try {
            console.info("Getting movie from database with movie id: " + movieId);
            const drizzle = this.databaseAdapter.getClient();
            const movieResponse = await drizzle
                .select({
                    movieId: moviesTable.movieId,
                    title: moviesTable.title,
                    director: moviesTable.director,
                    posterPath: moviesTable.posterPath,
                })
                .from(moviesTable)
                .where(eq(moviesTable.movieId, movieId));
            if (movieResponse.length === 0) {
                throw new NotFoundError("The Movie you requested could not be found");
            }
            const movie = new Movie(movieResponse[0].movieId, movieResponse[0].title, movieResponse[0].director, movieResponse[0].posterPath);
            console.info('Retrieved movie from database:');
            console.info(movie);
            return movie;
        } catch (e) {
            console.info(e);
            throw e;
        }
    }

    async addMovie(movieId: number): Promise<Movie> {
        try {
            console.info("Adding movie from TMDB to database with movie id: " + movieId)
            const drizzle = this.databaseAdapter.getClient();
            const tmdbMovie = await this.movieApiAdapter.getMovieByMovieId(movieId);
            console.info('Got movie info from TMDB');
            const director = await this.movieApiAdapter.getDirectorByMovieId(movieId);
            console.info('Got director of movie from TMDB');
            const movie = {
                movieId: tmdbMovie.movieId,
                title: tmdbMovie.title,
                director: director,
                posterPath: tmdbMovie.posterPath
            }
            const insertResponse = await drizzle.insert(moviesTable).values(movie).returning({
                movieId: moviesTable.movieId,
                title: moviesTable.title,
                director: moviesTable.director,
                posterPath: moviesTable.posterPath
            });
            const newMovie = new Movie(insertResponse[0].movieId, insertResponse[0].title, insertResponse[0].director, insertResponse[0].posterPath);
            console.info('Inserted Movie into database:');
            console.info(newMovie);
            return newMovie;
        } catch(e) {
            console.info(e);
            throw(e);
        }
    }

    private convertToMovieSearchResult(
        searchResult: MultiMediaSearchResult
    ): MovieSearchResult[] {
        if (searchResult instanceof MovieSearchResult) {
            return [searchResult];
        }
        if (searchResult instanceof PersonSearchResult) {
            return searchResult.knownFor;
        }
        return [];
    }
}

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
            console.log("Searching TMDB for movies");
            const multiSearchResults =
                await this.movieApiAdapter.searchMultiMedia({
                    searchQuery: searchQuery,
                    page: pageNumber,
                });

            const movieSearchResults = multiSearchResults.map((searchResult) =>
                this.convertToMovieSearchResult(searchResult)
            );
            const flattenedMovieSearchResults = movieSearchResults.flat();

            console.log("Searching TMDB for ");
            return flattenedMovieSearchResults;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async getMovieById(movieId: number): Promise<Movie> {
        // try {
        //     console.log("Getting movie from database");
        //     const movieResponse = this.databaseAdapter
        //         .select({
        //             movieId: moviesTable.movieId,
        //             title: moviesTable.title,
        //             director: moviesTable.director,
        //             posterPath: moviesTable.posterPath,
        //         })
        //         .from(moviesTable)
        //         .where(eq(moviesTable.movieId, movieId));
        //     //if (movieResponse)
        // } catch (e) {
        //     console.log(e);
        //     throw e;
        // }
        return new Movie(1, "", "", "");
    }

    async addMovie(movieId: number): Promise<Movie> {
        return new Movie(1, "", "", "");
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

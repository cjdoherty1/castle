import fetch from "node-fetch";
import { NetworkError, NotFoundError } from "../../business/Errors";
import {
    MovieSearchResult,
    MultiMediaSearchResult,
    PersonSearchResult,
} from "../../business/movies/SearchResult";
import { Movie } from "../../business/movies/Movie";

const MOVIE_API_BASE_URL = "https://api.themoviedb.org/3/";

interface SearchMultiMediaParams {
    searchQuery: string;
    page: number;
}

export class MovieApiAdapter {
    async searchMultiMedia({
        searchQuery,
        page,
    }: SearchMultiMediaParams): Promise<MultiMediaSearchResult[]> {
        try {
            console.info("Searching multi media from TMDB API with query", {
                searchQuery: searchQuery,
                page: page,
            });
            const params = new URLSearchParams({
                query: searchQuery,
                include_adult: "false",
                page: page.toString(),
            });
            const url = `${MOVIE_API_BASE_URL}search/multi?${params.toString()}`;

            const response: Response = await fetch(url, {
                method: "GET",
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                console.error("Failed to reach TMDB API", {
                    statusCode: response.status,
                    status: response.statusText,
                });
                throw new NetworkError(
                    `'Failed to reach TMDB API - ${response.status} ${response.statusText}`
                );
            }

            const searchResults = await response.json();
            const filteredSearchResult = searchResults["results"].filter(
                (searchResult) =>
                    searchResult.media_type === "movie" ||
                    searchResult.media_type === "person"
            );
            const multiMediaSearchResults = filteredSearchResult.map(
                (searchResult) =>
                    this.convertSearchResultToMultiMediaSearchResult(
                        searchResult
                    )
            );

            console.info("Successfully retrieved search results from TMDB API", {
                numberOfResults: multiMediaSearchResults.length,
            });

            return multiMediaSearchResults;
        } catch (e) {
            console.info("Failed to search for multi media", { error: e });
            throw e;
        }
    }

    async getMovieByMovieId(movieId: number): Promise<Movie> {
        try {
            console.log("Getting movie from TMDB with id: " + movieId);
            const url = `${MOVIE_API_BASE_URL}movie/${movieId}`;

            const response: Response = await fetch(url, {
                method: "GET",
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                console.error("Failed to reach TMDB API", {
                    statusCode: response.status,
                    status: response.statusText,
                });

                if (response.status === 404) {
                    throw new NotFoundError(response.statusText);
                }

                throw new NetworkError(
                    `'Failed to reach TMDB API - ${response.status} ${response.statusText}`
                );
            }
            const tmdbMovie = await response.json();
            const movie = new Movie(
                tmdbMovie.id,
                tmdbMovie.title,
                "",
                tmdbMovie.poster_path
            );

            return movie;
        } catch (e) {
            console.log("Failed to get movie from TMDB", { error: e });
            throw e;
        }
    }

    async getDirectorByMovieId(movieId: number): Promise<string> {
        try {
            console.log(
                "Getting accessing TMDB to get director for movie with id: " +
                    movieId
            );
            const url = `${MOVIE_API_BASE_URL}movie/${movieId}/credits`;

            const response: Response = await fetch(url, {
                method: "GET",
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                console.error("Failed to reach TMDB API", {
                    statusCode: response.status,
                    status: response.statusText,
                });

                if (response.status === 404) {
                    throw new NotFoundError(response.statusText);
                }

                throw new NetworkError(
                    `'Failed to reach TMDB API - ${response.status} ${response.statusText}`
                );
            }
            const tmdbCredits = await response.json();
            const crew = tmdbCredits["crew"];
            const director = crew.filter(
                (member) => member.job === "Director"
            )[0].name;
            return director;
        } catch (e) {
            console.log("Failed to get director from TMDB", { error: e });
            throw e;
        }
    }

    private convertSearchResultToMultiMediaSearchResult(
        searchResult
    ): MultiMediaSearchResult {
        if (searchResult.media_type === "movie") {
            return new MovieSearchResult({
                movieId: searchResult.id,
                title: searchResult.title,
                overview: searchResult.overview,
                posterPath: searchResult.poster_path,
                releaseDate: searchResult.release_date,
            });
        }
        if (searchResult.media_type === "person") {
            const filteredKnownFor = searchResult.known_for.filter(
                (knownFor) => knownFor.media_type === "movie"
            );
            const KnownForMovieSearchResults = filteredKnownFor.map(
                (movie) =>
                    new MovieSearchResult({
                        movieId: movie.id,
                        title: movie.title,
                        overview: movie.overview,
                        posterPath: movie.poster_path,
                        releaseDate: movie.release_date,
                    })
            );
            return new PersonSearchResult({
                knownFor: KnownForMovieSearchResults,
            });
        }
    }

    private getHeaders() {
        return {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
        };
    }
}

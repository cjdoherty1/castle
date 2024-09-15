import { Movie } from "./Movie";
import { MovieSearchResult } from "./SearchResult";

export interface IMovieRepository {
    searchMovie(searchQuery: string, pageNumber: number): Promise<MovieSearchResult[]>;

    getMovieById(movieId: number): Promise<Movie>;

    addMovie(movieId: number): Promise<Movie>;
}
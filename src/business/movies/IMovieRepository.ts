import { Movie } from "./Movie";

export interface IMovieRepository {
    searchMovie(searchQuery: string): Promise<Movie[]>;

    getMovie(movieId: number): Promise<Movie>;

    addMovie(movieId: number): Promise<Movie>;
}
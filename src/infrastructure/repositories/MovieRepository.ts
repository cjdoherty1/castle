import { DatabaseAdapter } from "../DatabaseAdapter";
import { Movie } from "../../business/movies/Movie";
import { IMovieRepository } from "../../business/movies/IMovieRepository";
import { MovieApiAdapter } from "../movies/MovieApiAdapter";

export class MovieRepository implements IMovieRepository {
    private databaseAdapter;
    private movieApiAdapter: MovieApiAdapter;

    constructor(databaseAdapter: DatabaseAdapter, movieApiAdapter: MovieApiAdapter) {
        this.databaseAdapter = databaseAdapter;
        this.movieApiAdapter = movieApiAdapter;
    }

    async searchMovie(searchQuery: string): Promise<Movie[]> {
        return [new Movie(1, "", "", "")];
    }

    async getMovie(movieId: number): Promise<Movie> {
        return new Movie(1, "", "", "");
    }

    async addMovie(movieId: number): Promise<Movie> {
        return new Movie(1, "", "", "");
    }
}
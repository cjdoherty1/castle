import { DatabaseAdapter } from "../DatabaseAdapter";
import { Movie } from "../../business/movies/Movie";

export class MovieRepository implements IMovieRepository {
    private databaseAdapter;

    constructor(databaseAdapter: DatabaseAdapter) {
        this.databaseAdapter = databaseAdapter;
    }

    async searchMovie(query: string) {

    }

    async getMovie(movieId: number): Promise<Movie> {
        return new Movie(1, "", "", "");
    }

    async addMovie(movieId: number): Promise<Movie> {
        return new Movie(1, "", "", "");
    }
}
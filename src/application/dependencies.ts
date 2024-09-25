import { DatabaseAdapter } from "../infrastructure/DatabaseAdapter";
import { MovieApiAdapter } from "../infrastructure/movies/MovieApiAdapter";
import { MovieRepository } from "../infrastructure/repositories/MovieRepository";
import { WatchlistRepository } from "../infrastructure/repositories/WatchlistRepository";
import { MovieController } from "./controllers/MovieController";
import { WatchlistController } from "./controllers/WatchlistController";

export const databaseAdapter = new DatabaseAdapter();
export const movieApiAdapter = new MovieApiAdapter();

export const movieRepository = new MovieRepository(databaseAdapter, movieApiAdapter);
export const movieController = new MovieController(movieRepository);

export const watchlistRepository = new WatchlistRepository(databaseAdapter, movieRepository);
export const watchlistController = new WatchlistController(watchlistRepository);
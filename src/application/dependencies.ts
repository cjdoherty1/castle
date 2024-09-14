import { DatabaseAdapter } from "../infrastructure/DatabaseAdapter";
import { MovieRepository } from "../infrastructure/repositories/MovieRepository";
import { WatchlistRepository } from "../infrastructure/repositories/WatchlistRepository";
import { MovieController } from "./controllers/MovieController";
import { WatchlistController } from "./controllers/WatchlistController";

export const databaseAdapter = new DatabaseAdapter();
export const watchlistRepository = new WatchlistRepository(databaseAdapter);
export const watchlistController = new WatchlistController(watchlistRepository);

export const movieRepository = new MovieRepository(databaseAdapter);
export const movieController = new MovieController(movieRepository);
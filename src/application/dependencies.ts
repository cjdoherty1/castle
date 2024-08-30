import { DatabaseAdapter } from "../infrastructure/DatabaseAdapter";
import { WatchlistRepository } from "../infrastructure/WatchlistRepository";
import { WatchlistController } from "./controllers/WatchlistController";


export const databaseAdapter = new DatabaseAdapter()
export const watchlistRepository = new WatchlistRepository(databaseAdapter);
export const watchlistController = new WatchlistController(watchlistRepository);
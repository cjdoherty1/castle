import { WatchlistRepository } from "../../infrastructure/WatchlistRepository";
import { Watchlist } from "../../business/watchlist/Watchlist";


export class WatchlistController {
    private watchlistRepository;
    constructor(watchlistRepository: WatchlistRepository) {
        this.watchlistRepository = watchlistRepository;
    }

    public getWatchlistByWatchlistId(id: number): Watchlist {
        return this.watchlistRepository.getWatchlistByWatchListId(id);
    }

    public addWatchlistItem(userId: number, watchlistId: number, movieId: number) {
        this.watchlistRepository.addWatchlistItem(userId, watchlistId, movieId);
    }
}
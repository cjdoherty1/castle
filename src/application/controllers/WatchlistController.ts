import { WatchlistRepository } from "../../infrastructure/WatchlistRepository";
import { Watchlist } from "../../business/watchlist/Watchlist";


export class WatchlistController {
    private watchlistRepository;
    constructor(watchlistRepository: WatchlistRepository) {
        this.watchlistRepository = watchlistRepository;
    }

    public async getWatchlistByWatchlistId(id: number): Promise<Watchlist> {
        const watchlist = await this.watchlistRepository.getWatchlistByWatchListId(id);
        return watchlist;
    }

    public addWatchlistItem( watchlistId: number, movieId: number) {
        this.watchlistRepository.addWatchlistItem(watchlistId, movieId);
    }
}
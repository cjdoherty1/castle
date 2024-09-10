import { WatchlistRepository } from "../../infrastructure/WatchlistRepository";
import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware";



export class WatchlistController {
    private watchlistRepository;
    constructor(watchlistRepository: WatchlistRepository) {
        this.watchlistRepository = watchlistRepository;
    }

    public async getWatchlistByWatchlistId(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.token.sub;
            const watchlist = await this.watchlistRepository.getWatchlistByWatchListId(parseInt(req.params["watchlistId"]), userId);
            res.json({ watchlist: watchlist });
        } catch(e) {
            console.log(e);
            next(e);
        }
    }

    public addWatchlistItem( watchlistId: number, movieId: number) {
        this.watchlistRepository.addWatchlistItem(watchlistId, movieId);
    }

    public createWatchlist(userId: string, watchlistName: string) {
        this.watchlistRepository.createWatchlist(userId, watchlistName);
    }
}
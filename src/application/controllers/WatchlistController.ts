import { WatchlistRepository } from "../../infrastructure/WatchlistRepository";
import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware";

export class WatchlistController {
    private watchlistRepository;
    constructor(watchlistRepository: WatchlistRepository) {
        this.watchlistRepository = watchlistRepository;
    }

    public async getWatchlistByWatchlistId(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.token.sub;
            const watchlistId = parseInt(req.params["watchlistId"]);
            const watchlist =
                await this.watchlistRepository.getWatchlistByWatchListId(
                    watchlistId,
                    userId
                );
            res.json({ watchlist: watchlist });
        } catch (e) {
            next(e);
        }
    }

    public async addWatchlistItem(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const watchlistId = parseInt(req.params["watchlistId"]);
            const movieId = parseInt(req.params["movieId"]);
            const userId = req.token.sub;
            const watchlistItem = await this.watchlistRepository.addWatchlistItem(
                watchlistId,
                movieId,
                userId
            );
            res.status(201).json({ watchlistItem: watchlistItem });
        } catch (e) {
            next(e);
        }
    }

    public async createWatchlist(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.token.sub;
            const watchlistName = req.params["watchlistName"];
            const watchlist = await this.watchlistRepository.createWatchlist(userId, watchlistName);
            
            res.status(201).json({ watchlist: watchlist });
        } catch (e) {
            next(e);
        }
    }
}

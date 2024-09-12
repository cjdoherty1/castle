import { WatchlistRepository } from "../../infrastructure/WatchlistRepository";
import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware";
import { params } from "../middleware";

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
            console.log("Getting watchlist by watchlist id");
            const userId = req.token.sub;
            const watchlistId = parseInt(req.params[params.watchlistId]);
            const watchlist =
                await this.watchlistRepository.getWatchlistByWatchListId(
                    watchlistId,
                    userId
                );
            console.log("Retrived watchlist:");
            console.log(watchlist);
            res.json({ watchlist: watchlist });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    public async addWatchlistItem(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            console.log("Adding watchlist item");
            const watchlistId = parseInt(req.params[params.watchlistId]);
            const movieId = parseInt(req.params[params.movieId]);
            const userId = req.token.sub;
            const watchlistItem = await this.watchlistRepository.addWatchlistItem(
                watchlistId,
                movieId,
                userId
            );
            console.log("Added watchlist by watchlist id:");
            console.log(watchlistItem);
            res.status(201).json({ watchlistItem: watchlistItem });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    public async createWatchlist(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            console.log("Creating watchlist");
            const watchlistName = req.params[params.watchlistName];
            const userId = req.token.sub;
            const watchlist = await this.watchlistRepository.createWatchlist(watchlistName, userId);
            console.log("Created watchlist:");
            console.log(watchlist);
            res.status(201).json({ watchlist: watchlist });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    public async deleteWatchlistItem(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            console.log("Deleted watchlist item");
            const watchlistItemId = parseInt(req.params[params.watchlistItemId]);
            const userId = req.token.sub;
            const watchlistItem = await this.watchlistRepository.deleteWatchlistItem(
                watchlistItemId,
                userId
            );
            console.log("Deleted watchlist item:");
            console.log(watchlistItem);
            res.status(202).json({ watchlistItem: watchlistItem });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    public async deleteWatchlist(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            console.log("Delete watchlist");
            const watchlistId = parseInt(req.params[params.watchlistId]);
            const userId = req.token.sub;
            const watchlist = await this.watchlistRepository.deleteWatchlist(watchlistId, userId);
            console.log("Deleted watchlist:");
            console.log(watchlist);
            
            res.status(202).json({ watchlist: watchlist });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
}

import { WatchlistRepository } from "../../infrastructure/repositories/WatchlistRepository";
import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware";
import { params } from "../middleware";

export class WatchlistController {
    private watchlistRepository: WatchlistRepository;
    constructor(watchlistRepository: WatchlistRepository) {
        this.watchlistRepository = watchlistRepository;
    }


    public async getAllWatchlists(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            console.info("Getting all watchlists");
            const userId = req.token.sub;
            const allWatchlists = await this.watchlistRepository.getAllWatchlists(userId);
            console.info("Got all watchlists");
            console.info({ allWatchlists: allWatchlists });
            res.json({allWatchlists})
        } catch(e) {
            console.log(e);
            next(e);
        }
    }

    public async getWatchlistByWatchlistId(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            console.info("Getting watchlist by watchlist id");
            const userId = req.token.sub;
            const watchlistId = parseInt(req.params[params.watchlistId]);
            const watchlist =
                await this.watchlistRepository.getWatchlistByWatchlistId(
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
    ): Promise<void> {
        try {
            console.log("Adding watchlist item");
            const watchlistId = parseInt(req.params[params.watchlistId]);
            const movieId = parseInt(req.params[params.movieId]);
            const userId = req.token.sub;
            const watchlistItem =
                await this.watchlistRepository.addWatchlistItem(
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
    ): Promise<void> {
        try {
            console.log("Creating watchlist");
            const watchlistName = req.params[params.watchlistName];
            const userId = req.token.sub;
            const watchlist = await this.watchlistRepository.createWatchlist(
                watchlistName,
                userId
            );
            console.log("Created watchlist:");
            console.log(watchlist);
            res.status(201).json({ watchlist: watchlist });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    public async createDefaultWatchlists(
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            console.info('Creating default watchlist and watched list');
            const userId = req.token.sub;
            const defaultWatchlist = await this.watchlistRepository.createWatchlist(
                'Gotta See',
                userId,
            );
            const defaultWatchedlist = await this.watchlistRepository.createWatchlist(
                'Seen It',
                userId,
                true,
            );

            console.info('Created default watchlist and watched list');
            console.info({ watchlist: defaultWatchlist, watchedList: defaultWatchedlist });
            res.status(201).json({ watchlist: defaultWatchlist, watchedList: defaultWatchedlist })
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    public async deleteWatchlistItem(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            console.log("Deleted watchlist item");
            const watchlistItemId = parseInt(
                req.params[params.watchlistItemId]
            );
            const userId = req.token.sub;
            const watchlistItem =
                await this.watchlistRepository.deleteWatchlistItem(
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
    ): Promise<void> {
        try {
            console.log("Delete watchlist");
            const watchlistId = parseInt(req.params[params.watchlistId]);
            const userId = req.token.sub;
            const watchlist = await this.watchlistRepository.deleteWatchlist(
                watchlistId,
                userId
            );
            console.log("Deleted watchlist:");
            console.log(watchlist);

            res.status(202).json({ watchlist: watchlist });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
}

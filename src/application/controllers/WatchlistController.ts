import { WatchlistRepository } from "../../infrastructure/repositories/WatchlistRepository";
import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware";
import { params } from "../middleware";
import { v4 as uuidv4 } from "uuid";
import { param } from "express-validator";

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
            const watchlistId = req.params[params.watchlistId];
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
            const watchlistId = req.params[params.watchlistId];
            console.log(watchlistId)
            const movieId = parseInt(req.params[params.movieId]);
            const userId = req.token.sub;
            const watchlistItemId = req.params[params.watchlistItemId]
            const movie =
                await this.watchlistRepository.addWatchlistItem(
                    watchlistId,
                    movieId,
                    userId,
                    watchlistItemId
                );
            console.log("Added movie to watchlist:");
            console.log(movie);
            res.status(201).json({movie});
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
            const watchlistId = req.params[params.watchlistId]
            const watchlist = await this.watchlistRepository.createWatchlist(
                watchlistName,
                userId,
                false,
                watchlistId
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
            const wlid = req.params[params.watchlistId];
            const wedid = req.params[params.watchedListId]
            const defaultWatchlist = await this.watchlistRepository.createWatchlist(
                'Watchlist',
                userId,
                false,
                wlid
            );
            const defaultWatchedlist = await this.watchlistRepository.createWatchlist(
                'Watched',
                userId,
                true,
                wedid
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
            const watchlistItemId = req.params[params.watchlistItemId];
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
            const watchlistId = req.params[params.watchlistId];
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

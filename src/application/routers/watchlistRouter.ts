import express, { NextFunction, Response } from "express";
import { watchlistController } from "../dependencies";
import {
    AuthRequest,
    validateAuthentication,
    validateParams,
    params,
} from "../middleware";

const watchlistRouter = express.Router();

watchlistRouter.get("/getAllWatchlists",
    validateAuthentication,
    (req: AuthRequest, res: Response, next: NextFunction) => {
        watchlistController.getAllWatchlists(req, res, next);
    }
)

watchlistRouter.get(
    "/getWatchlist/:" + params.watchlistId,
    validateParams,
    validateAuthentication,
    (req: AuthRequest, res: Response, next: NextFunction) => {
        watchlistController.getWatchlistByWatchlistId(req, res, next);
    }
);

watchlistRouter.post(
    "/addWatchlistItem/:" + params.watchlistId + "/:" + params.movieId + "/:" + params.watchlistItemId, 
    validateParams,
    validateAuthentication,
    (req: AuthRequest, res: Response, next: NextFunction) => {
        watchlistController.addWatchlistItem(req, res, next);
    }
);

watchlistRouter.post(
    "/createWatchlist/:" + params.watchlistName + "/:" + params.watchlistId,
    validateParams,
    validateAuthentication,
    (req: AuthRequest, res: Response, next: NextFunction) => {
        watchlistController.createWatchlist(req, res, next);
    }
);

watchlistRouter.delete(
    "/deleteWatchlistItem/:" + params.watchlistItemId,
    validateParams,
    validateAuthentication,
    (req: AuthRequest, res: Response, next: NextFunction) => {
        watchlistController.deleteWatchlistItem(req, res, next);
    }
);

watchlistRouter.delete(
    "/deleteWatchlist/:" + params.watchlistId,
    validateParams,
    validateAuthentication,
    (req: AuthRequest, res: Response, next: NextFunction) => {
        watchlistController.deleteWatchlist(req, res, next);
    }
);

watchlistRouter.post(
    "/createDefaultWatchlists/:" + params.watchlistId + "/:" + params.watchedListId,
    validateParams,
    validateAuthentication,
    (req: AuthRequest, res: Response, next: NextFunction) => {
        watchlistController.createDefaultWatchlists(req, res, next);
    }
);

export default watchlistRouter;

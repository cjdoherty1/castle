import express, { NextFunction, Response } from "express";
import { watchlistController } from "../dependencies";
import {
    AuthRequest,
    validateAuthentication,
    validateParams,
} from "../middleware";

const watchlistRouter = express.Router();

watchlistRouter.get(
    "/getWatchlist/:watchlistId",
    validateParams,
    validateAuthentication,
    (req: AuthRequest, res, next) => {
        watchlistController.getWatchlistByWatchlistId(req, res, next);
    }
);

watchlistRouter.post(
    "/addWatchlistItem/:watchlistId/:movieId",
    validateParams,
    validateAuthentication,
    (req: AuthRequest, res: Response, next: NextFunction) => {
        watchlistController.addWatchlistItem(req, res, next);
    }
);

watchlistRouter.post(
    "/createWatchlist/:watchlistName",
    validateParams,
    validateAuthentication,
    (req: AuthRequest, res: Response, next: NextFunction) => {
        watchlistController.createWatchlist(req, res, next);
    }
);

export default watchlistRouter;

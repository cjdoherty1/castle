import express from "express";
import { watchlistController } from "../dependencies";
import { AuthRequest, errorHandler, validateAuthentication } from "../middleware";

const watchlistRouter = express.Router();

watchlistRouter.get(
    "/getWatchlist/:watchlistId",
    validateAuthentication,
    (req: AuthRequest, res, next) => {
        watchlistController.getWatchlistByWatchlistId(req, res, next);
    }
);

watchlistRouter.post("/addWatchlistItem/:watchlistId/:movieId", (req, res) => {
    res.send(
        watchlistController.addWatchlistItem(
            parseInt(req.params["watchlistId"]),
            parseInt(req.params["movieId"])
        )
    );
});

watchlistRouter.post("/createWatchlist/:userId/:watchlistName", (req, res) => {
    res.send(
        watchlistController.createWatchlist(
            req.params["userId"],
            req.params["watchlistName"]
        )
    );
});

export default watchlistRouter;

import express from "express";
import { watchlistController } from "../dependencies";

const watchlistRouter = express.Router();

watchlistRouter.get('/getWatchlist/:watchlistId', (req, res) => {
    res.send(watchlistController.getWatchlistByWatchlistId(parseInt(req.params['watchlistId'])))
});

watchlistRouter.post('/addWatchlistItem/:userId/:watchlistId/:movieId', (req, res) => {
    res.send(watchlistController.addWatchlistItem(parseInt(req.params['userId']), parseInt(req.params['watchlistId']), parseInt(req.params['movieId'])))
});

export default watchlistRouter;
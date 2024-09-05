import express from "express";
import { watchlistController } from "../dependencies";

const watchlistRouter = express.Router();

watchlistRouter.get('/getWatchlist/:watchlistId', async (req, res) => {
    res.send(await watchlistController.getWatchlistByWatchlistId(parseInt(req.params['watchlistId'])))
});

watchlistRouter.post('/addWatchlistItem/:watchlistId/:movieId', (req, res) => {
    res.send(watchlistController.addWatchlistItem(parseInt(req.params['watchlistId']), parseInt(req.params['movieId'])));
});

export default watchlistRouter;
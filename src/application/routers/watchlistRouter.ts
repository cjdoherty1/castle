import express from "express";
import { watchlistController } from "../dependencies";
import { NotFoundError, BadRequestError } from "../../business/Errors";
import { validateAuthentication } from "../middleware";

const watchlistRouter = express.Router();

watchlistRouter.get(
    '/getWatchlist/:watchlistId',
    validateAuthentication,
    async (req, res, next) => {
    try {
        const watchlistIdReq = req.params['watchlistId'];
        if (watchlistIdReq.match(/[^\d]/)) {                                                                //do I need to check if this is above number max value? if so how
            throw new BadRequestError("\"" + req.params['watchlistId'] + "\"" + " is not a valid id.");
        }
        const watchlistId = parseInt(req.params['watchlistId']);
        const watchlist = await watchlistController.getWatchlistByWatchlistId(watchlistId)
        res.json({ watchlist: watchlist });
    } catch(e) {
        switch(e.name) {
            case "NotFoundError":
                res.status(404);
                res.send(e.message);
                break;
            case "BadRequestError":
                res.status(400);
                res.send(e.message);
                break;
        }
    }
});

watchlistRouter.post('/addWatchlistItem/:watchlistId/:movieId', (req, res) => {
    res.send(watchlistController.addWatchlistItem(parseInt(req.params['watchlistId']), parseInt(req.params['movieId'])));
});

watchlistRouter.post('/createWatchlist/:userId/:watchlistName', (req, res) => {
    res.send(watchlistController.createWatchlist(req.params['userId'], req.params['watchlistName']));
});


export default watchlistRouter;
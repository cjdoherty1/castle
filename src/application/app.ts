import express from "express";
import router from "./router"
import bodyParser from 'body-parser';
import watchlistRouter from './watchlist/watchlistRouter'


const app = express();
app.use(bodyParser.json());

app.use('/', router);
app.use('/watchlist', watchlistRouter);

app.get("/health", (req, res) => {
    res.send("Healthy!");
});

export { app };





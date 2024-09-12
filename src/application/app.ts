import express from "express";
import bodyParser from 'body-parser';
import watchlistRouter from './routers/watchlistRouter'
import { errorHandler } from "./middleware";


const app = express();

var cors = require('cors')
app.use(cors());

app.use(bodyParser.json());

app.get("/health", (req, res) => {
    res.send("Healthy!");
});


app.use('/watchlist', watchlistRouter);
app.use(errorHandler);

export { app };





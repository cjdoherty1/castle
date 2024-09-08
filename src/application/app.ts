import express from "express";

import router from "./router"
import bodyParser from 'body-parser';
import watchlistRouter from './routers/watchlistRouter'


const app = express();

var cors = require('cors')
app.use(cors());

app.use(bodyParser.json());

app.use('/', router);
app.use('/watchlist', watchlistRouter);

app.get("/health", (req, res) => {
    res.send("Healthy!");
});

export { app };





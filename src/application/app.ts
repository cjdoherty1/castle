import express from "express";
import bodyParser from "body-parser";
import watchlistRouter from "./routers/watchlistRouter";
import { errorHandler } from "./middleware";
import { movieRouter } from "./routers/movieRouter";

const app = express();

var cors = require("cors");
app.use(cors());

app.use(bodyParser.json());

app.get('/health', (req, res) => {
    res.send('Healthy!');
});

const apiV1 = express()

apiV1.use('/watchlist', watchlistRouter);
apiV1.use('/movie', movieRouter);

app.use('/api/v1', apiV1);

app.use(errorHandler);

export { app };

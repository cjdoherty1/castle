import express from "express";
import { params } from "../middleware";
import { movieApiAdapter, movieRepository } from "../dependencies";

export const movieRouter = express.Router();

movieRouter.get(
    '/searchMultiMedia/',
    async (req, res, next) => {
        const searchResults = await movieApiAdapter.searchMultiMedia({ searchQuery: 'interstellar', page: 1 });

        res.json(searchResults);
    }
);

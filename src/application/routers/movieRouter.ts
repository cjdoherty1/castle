import express, { NextFunction, Response } from "express";
import { params, validateAuthentication, validateParams, AuthRequest } from "../middleware";
import { movieApiAdapter, movieController } from "../dependencies";

export const movieRouter = express.Router();

movieRouter.get(
    '/searchMultiMedia/:' + params.searchQuery + "/:" + params.pageNumber,
    validateParams,
    validateAuthentication,
    (req: AuthRequest, res: Response, next: NextFunction) => {
        movieController.searchMovie(req, res, next);
    }
);

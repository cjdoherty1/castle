import express, { NextFunction, Response } from "express";
import { params, validateAuthentication, validateParams, AuthRequest } from "../middleware";
import { movieApiAdapter, movieController, movieReviewController } from "../dependencies";

export const movieRouter = express.Router();

movieRouter.get(
    '/searchMultiMedia/:' + params.searchQuery + "/:" + params.pageNumber,
    validateParams,
    validateAuthentication,
    (req: AuthRequest, res: Response, next: NextFunction) => {
        movieController.searchMovie(req, res, next);
    }
);

movieRouter.get(
    '/getMovieById/:' + params.movieId,
    validateParams,
    validateAuthentication,
    (req: AuthRequest, res: Response, next: NextFunction) => {
        movieController.getMovie(req, res, next);
    }
);

movieRouter.post(
    '/addMovie/:' + params.movieId,
    validateParams,
    validateAuthentication,
    (req: AuthRequest, res: Response, next: NextFunction) => {
        movieController.addMovie(req, res, next);
    }
);

movieRouter.post(
    '/addMovieReview/:' + params.movieId,
    validateParams,
    validateAuthentication,
    (req: AuthRequest, res: Response, next: NextFunction) => {
        movieReviewController.createMovieReview(req, res, next);
    }
)
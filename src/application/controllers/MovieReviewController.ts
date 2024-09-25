import { Response, NextFunction } from "express";
import { MovieReviewRepository } from "../../infrastructure/repositories/MovieReviewRepository";
import { AuthRequest, params } from "../middleware";
import { AddMovieReview } from "../../business/movies/MovieReview";

export class MovieReviewController {
    private movieReviewRepository: MovieReviewRepository;

    constructor(movieReviewRepository: MovieReviewRepository) {
        this.movieReviewRepository = movieReviewRepository;
    }

    public async createMovieReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            console.info('Creating movie review');
            const body = req.body;
            const userId = req.token.sub;
            const score = parseFloat(body['score']);
            const review = body['review'];
            const movieId = parseInt(req.params['movieId']);

            const addMovieReview = new AddMovieReview(userId, score, review, movieId);

            const movieReview = await this.movieReviewRepository.createMovieReview(addMovieReview);

            console.info('Created new movie review');
            console.info({ movieReview: movieReview });
            res.status(201).json({ movieReview: movieReview });
        } catch (e) {
            console.error(e);
            next(e);
        }
    }
}
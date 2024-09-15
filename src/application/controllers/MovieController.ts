import { MovieRepository } from "../../infrastructure/repositories/MovieRepository";
import { NextFunction, Response } from "express";
import { AuthRequest, params } from "../middleware";

export class MovieController {
    private movieRepository;
    constructor(movieRepository: MovieRepository) {
        this.movieRepository = movieRepository;
    }

    public async searchMovie(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            console.log("Searching movies");
            const searchQuery = req.params[params.searchQuery];
            const pageNumber = req.params[params.pageNumber]
            const searchResults = await this.movieRepository.searchMovie(searchQuery, pageNumber);
            console.log("Retrieved search results:");
            console.log(searchResults);
            res.status(200).json({ searchResults: searchResults });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    public async getMovie(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            console.log("Getting movie");
            const movieId = req.params[params.movieId];
            const movie = await this.movieRepository.getMovie(movieId);
            console.log("Retrieved movie:");
            console.log(movie);
            res.status(200).json({ movie: movie });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    public async addMovie(req: AuthRequest, res: Response, next: NextFunction) {
        console.log("Adding movie");
        const movieId = req.params[params.movieId];
        const movie = await this.movieRepository.addMovie(movieId);
        console.log("Added movie:");
        console.log(movie);
        res.status(200).json({ movie: movie });
    }
}

import { NextFunction, Request, Response } from "express";
import { query, validationResult, param } from "express-validator";
import { NotFoundError, BadRequestError } from "../business/Errors";
import * as jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    token;
}

export interface Token {
    sub: string;
}

export const params = {
    watchlistId: "watchlistId",
    movieId: "movieId",
    watchlistItemId: "watchlistItemId",
    watchlistName: "watchlistName",
    searchQuery: "searchQuery",
    pageNumber: "pageNumber",
};

export const validateParams = [
    param(params.watchlistId)
        .optional()
        .isInt()
        .notEmpty()
        .withMessage("Invalid watchlistId"),
    param(params.movieId)
        .optional()
        .isInt()
        .notEmpty()
        .withMessage("Invalid movieId"),
    param(params.watchlistItemId)
        .optional()
        .isInt()
        .notEmpty()
        .withMessage("Invalid watchlistId"),
    param(params.watchlistName)
        .optional()
        .isString()
        .notEmpty()
        .withMessage("Invalid watchlistName"),

    (req, res, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

export function validateAuthentication(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        // Verify the token using the Supabase JWT secret
        const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
        req.token = decoded; // Attach the user info to the request object
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
}

export function errorHandler(
    e: Error,
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void {
    const errorStatus = getErrorStatus(e);
    res.status(errorStatus).json({ error: e.message });
}

function getErrorStatus(e: Error): number {
    if (e instanceof BadRequestError) {
        return 400;
    } else if (e instanceof NotFoundError) {
        return 404;
    } else {
        return 500;
    }
}

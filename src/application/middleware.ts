import { NextFunction, Request, Response } from "express";
import { NotFoundError, BadRequestError } from "../business/Errors";
import * as jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    token;
}

export interface Token {
    sub: string
}

export function validateAuthentication(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
        // Verify the token using the Supabase JWT secret
        const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
        req.token = decoded; // Attach the user info to the request object
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

export function errorHandler(e: Error, req: AuthRequest, res: Response, next: NextFunction) {
    const errorStatus = getErrorStatus(e);
    res.status(errorStatus).json({ error: e.message });
}

function getErrorStatus(e: Error) {
    if (e instanceof BadRequestError) {
        return 400;
    }

    if (e instanceof NotFoundError) {
        return 404;
    }
}


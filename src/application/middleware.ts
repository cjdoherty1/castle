import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    token;
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
        console.log(req.token)
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token' });
    }
}
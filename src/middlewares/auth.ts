import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongodb';

declare global {
    namespace Express {
        interface Request {
            user?: Document;
            token?: string;
        }
    }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error('Token not found');
        }
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        const user = await User.findOne({
            _id: decoded._id,
        });
        if (!user) {
            throw new Error('Unable to login');
        }
        req.user = user;
        req.token = token;
        next();
    } catch (error: any) {
        res.status(401).send({ error: error.message });
    }
};

export default auth;

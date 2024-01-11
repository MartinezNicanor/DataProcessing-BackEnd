import { Request, Response } from 'express';
import { db } from '../db';
import responder from '../utils/responder';
import { User } from '../types/user';


export const getMovie = async (req: Request & {user? : User}, res: Response): Promise<void> => {

    const movieId: string = req.params.movieId!;

    if (!req.params.movieId) {
        responder(res, 400, 'error', 'Movie ID is required');
        return;
    }

    if (isNaN(Number(movieId))) {
        responder(res, 400, 'error', 'Movie ID must be a number');
        return;
    }

    try {
        //! DB CONNECTION HERE -----------------------------------------------------------------------------------
        const movieObject: null | any = await db.oneOrNone('SELECT * FROM Movie WHERE movie_id = ${movieId}', {
            movieId: movieId
        });

        if (!movieObject) {
            responder(res, 404, 'error', 'Movie not found');
            return;
        }

        responder(res, 200, 'application/json', movieObject);
        return;
    } catch (err) {
        responder(res, 500, 'error', 'Internal Server Error')
        return;
    }
    
}

export const getSeries = async (req: Request & {user? : User}, res: Response): Promise<void> => {};

export const patchUpdateMovie = async (req: Request & {user? : User}, res: Response): Promise<void> => {};

export const patchUpdateSeries = async (req: Request & {user? : User}, res: Response): Promise<void> => {};

export const getPersonalizedContent = async (req: Request & {user? : User}, res: Response): Promise<void> => {};

export const getViewingHistory = async (req: Request & {user? : User}, res: Response): Promise<void> => {};


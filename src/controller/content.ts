import { Request, Response } from 'express';
import { db } from '../db';
import responder from '../utils/responder';
import { User } from '../types/user';
import { validateNumbers } from '../utils/validators';


export const postWatchMovie = async (req: Request & {user? : User}, res: Response): Promise<void> => {

    const movieId: string = req.params.movieId!;
    const profileId: string = req.params.profileId!;
    const pauseTime: number = req.body.pausTime!;
    const finished: boolean = req.body.finished! ? req.body.finished! : false;


    if (!req.params.movieId || !req.params.profileId) {
        responder(res, 400, 'error', 'ID parameters are required');
        return;
    }

    if (isNaN(Number(movieId)) || isNaN(Number(profileId))) {
        responder(res, 400, 'error', 'Invalid Request');
        return;
    }

    if (validateNumbers([+movieId, +profileId, pauseTime])) {
        responder(res, 400, 'error', 'Invalid Request');
        return;
    }

    // Check if profile exists and if it matches the user
    try {
        const profileObject = await db.oneOrNone('SELECT * FROM Profile WHERE profile_id = ${profileId} AND account_id = ${accountId}', {
            profileId: profileId,
            accountId: req.user!.account_id
        });

        if ( profileObject === null ) {
            responder(res, 401, 'error', 'Unauthorized');
            return;
        }
    } catch (err) {
        responder(res, 500, 'error', 'Internal server error');
        return;
    }

    // Check if movie exists
    try {
        const movieObject = await db.oneOrNone('SELECT * FROM Movie WHERE movie_id = ${movieId}', {
            movieId: movieId
        });

        if ( movieObject === null ) {
            responder(res, 404, 'error', 'Movie not found');
            return;
        }
    } catch (err) {
        responder(res, 500, 'error', 'Internal server error');
        return;
    }

    //Create new movie watch entry
    try {
        await db.tx(async t => {

            const languageSettings = await t.oneOrNone('SELECT language FROM profile WHERE profile_id = ${profileId}', {
                profileId: profileId
            });

            await t.one('INSERT INTO watch_history (profile_id, finished) VALUES ($<profileId>, $<finished>) RETURNING watch_history_id',{
                profileId: profileId,
                finished: finished
            })

            await t.none('INSERT INTO movie_watch_history (movie_id,  pause_time, language_settings, movie_watch_date) VALUES ($<movieId>, $<pauseTime>, $<languageSettings>, $<movieWatchDate>)', {
                movieId: movieId,
                pauseTime: pauseTime,
                languageSettings: languageSettings.language,
                movieWatchDate: new Date(Date.now())
            });
        });
        responder(res, 201, 'success', 'Movie watch history created');
    } catch (err) {
        responder(res, 500, 'error', 'Internal server error');
        return;
    }
    
}

export const getWatchMovie = async (req: Request & {user? : User}, res: Response): Promise<void> => {
};

export const getWatchMovieSubtitle = async (req: Request & {user? : User}, res: Response): Promise<void> => {
};

export const postWatchSeries = async (req: Request & {user? : User}, res: Response): Promise<void> => {
};

export const getWatchSeries = async (req: Request & {user? : User}, res: Response): Promise<void> => {
};

export const getWatchSeriesSubtitle = async (req: Request & {user? : User}, res: Response): Promise<void> => {
};

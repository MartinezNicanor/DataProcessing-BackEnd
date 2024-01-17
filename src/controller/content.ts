import e, { Request, Response } from 'express';
import { db } from '../db';
import responder from '../utils/responder';
import { User } from '../types/user';
import { isValidTimeInterval, validateNumbers, languageValidator } from '../utils/validators';


export const postStartWatchMovie = async (req: Request & { user?: User }, res: Response): Promise<void> => {

    const movieId: number = req.body.movieId!;
    const profileId: string = req.params.profileId!;

    // TODO: Check if startTime is not longer than movie duration and  if the movieObject is finished, then start the movie from beggining        if its within 3 minitues of movie length then set the finished to true

    if (!req.body.movieId || !req.params.profileId) {
        console.log(req.body.movieId, req.params.profileId);
        responder(res, 400, 'error', 'ID parameters are required');
        return;
    }

    if (isNaN(Number(movieId)) || isNaN(Number(profileId))) {
        responder(res, 400, 'error', 'Invalid Request');
        return;
    }

    if (!validateNumbers([(Number(movieId)), (Number(profileId))])) {
        console.log(movieId, profileId, typeof (movieId), typeof (profileId), Number(movieId), Number(profileId))
        responder(res, 400, 'error', 'Invalid Request');
        return;
    }

    // Check if profile exists and if it matches the user
    try {
        const profileObject = await db.oneOrNone('SELECT * FROM Profile WHERE profile_id = ${profileId} AND account_id = ${accountId}', {
            profileId: profileId,
            accountId: req.user!.account_id
        });

        if (profileObject === null) {
            responder(res, 401, 'error', 'Unauthorized');
            return;
        }
    } catch (err) {
        console.log(err);
        responder(res, 500, 'error', 'Internal server error');
        return;
    }

    // Check if movie exists
    try {
        const movieObject = await db.oneOrNone('SELECT * FROM Movie WHERE movie_id = ${movieId}', {
            movieId: movieId
        });

        if (movieObject === null) {
            responder(res, 400, 'error', 'Content not found');
            return;
        }
    } catch (err) {
        responder(res, 500, 'error', 'Internal server error');
        return;
    }

    // Check if the latest movie watch history has event_type "End" in watch_history
    try {
        const watchHistoryObject = await db.oneOrNone('SELECT * FROM watch_history WHERE profile_id = $<profileId> ORDER BY watch_date DESC LIMIT 1', {
            profileId: profileId
        });

        if (watchHistoryObject !== null && watchHistoryObject.event_type === 'Start') {
            responder(res, 400, 'error', 'Previous movie watch history has not ended yet');
            return;
        }
    } catch (err) {
        responder(res, 500, 'error', 'Internal server error');
    }


    //Create new movie watch entry

    //TODO:  If the movieObject is finished, then start the movie from beggining, IF a movie history exists then  grab the start time from the last movie history entry and start the movie from there otherwise start time = 00:00:00
    //TODO RN add realistic movie durations in dummy data -> UPDATE DB -> write code to test it
    try {
        await db.tx(async t => {

            const previousWatchHistoryObject = await t.oneOrNone('SELECT * FROM watch_history WHERE profile_id = $<profileId> AND event_type = $<eventType> ORDER BY watch_date DESC LIMIT 1',
                {
                    profileId: profileId,
                    eventType: 'End'
                });

            const languageSettings = await t.oneOrNone('SELECT language FROM profile WHERE profile_id = ${profileId}', {
                profileId: profileId
            });

            //Check if previous watch history exists or if the movie is finished last time
            if (previousWatchHistoryObject === null || previousWatchHistoryObject.finished === true) {
                //If doesnt exist then start the movie from beggining

                const watchHisoryObject = await t.one('INSERT INTO watch_history (profile_id, event_type, finished) VALUES ($<profileId>, $<eventType>, $<finished>) RETURNING watch_history_id', {
                    profileId: profileId,
                    eventType: 'Start',
                    finished: false
                })

                await t.none('INSERT INTO movie_watch_history (movie_id,  pause_time, language_settings, watch_history_id) VALUES ($<movieId>, $<pauseTime>, $<languageSettings>, $<watchHistoryId>)', {
                    movieId: movieId,
                    pauseTime: '00:00:00',
                    languageSettings: languageSettings.language,
                    watchHistoryId: watchHisoryObject.watch_history_id,
                });
            } else {
                //If exists then start the movie from the last movie history entry
                const startTime = await t.one('SELECT pause_time FROM movie_watch_history WHERE watch_history_id = ${watchHistoryId}', {
                    watchHistoryId: previousWatchHistoryObject.watch_history_id

                });

                const watchHisoryObject = await t.one('INSERT INTO watch_history (profile_id, event_type, finished) VALUES ($<profileId>, $<eventType>, $<finished>) RETURNING watch_history_id', {
                    profileId: profileId,
                    eventType: 'Start',
                    finished: false
                })

                await t.none('INSERT INTO movie_watch_history (movie_id,  pause_time, language_settings, watch_history_id) VALUES ($<movieId>, $<pauseTime>, $<languageSettings>, $<watchHistoryId>)', {
                    movieId: movieId,
                    pauseTime: startTime.pause_time,
                    languageSettings: languageSettings.language,
                    watchHistoryId: watchHisoryObject.watch_history_id,
                });
            }
        });
        responder(res, 201, 'success', 'Movie watch history created');
        return;
    } catch (err) {
        console.log(err);
        responder(res, 500, 'error', 'Internal server error');
        return;
    }
};

export const postEndWatchMovie = async (req: Request & { user?: User }, res: Response): Promise<void> => {

    const movieId: string = req.body.movieId!;
    const profileId: string = req.params.profileId!;
    const endTime: string = req.body.endTime!;

    if (!req.body.movieId || !req.params.profileId) {
        responder(res, 400, 'error', 'ID parameters are required');
        return;
    }

    if (isNaN(Number(movieId)) || isNaN(Number(profileId))) {
        responder(res, 400, 'error', 'Invalid Request');
        return;
    }

    if (!validateNumbers([(Number(movieId)), (Number(profileId))])) {
        console.log(movieId, profileId, typeof (movieId), typeof (profileId), Number(movieId), Number(profileId))
        responder(res, 400, 'error', 'Invalid Request');
        return;
    }

    if (!isValidTimeInterval(endTime)) {
        responder(res, 400, 'error', 'Invalid Request');
        return;
    }

    // Check if profile exists and if it matches the user
    try {
        const profileObject = await db.oneOrNone('SELECT * FROM Profile WHERE profile_id = ${profileId} AND account_id = ${accountId}', {
            profileId: profileId,
            accountId: req.user!.account_id
        });

        if (profileObject === null) {
            responder(res, 401, 'error', 'Unauthorized');
            return;
        }
    } catch (err) {
        console.log(err);
        responder(res, 500, 'error', 'Internal server error');
        return;
    }

    // Check if movie exists
    try {
        const movieObject = await db.oneOrNone('SELECT * FROM Movie WHERE movie_id = ${movieId}', {
            movieId: movieId
        });

        if (movieObject === null) {
            responder(res, 400, 'error', 'Content not found');
            return;
        }
    } catch (err) {
        console.log(err);
        responder(res, 500, 'error', 'Internal server error');
        return;
    }

    // Check if the latest movie watch history has event_type "Start" in watch_history
    try {
        const watchHistoryObject = await db.oneOrNone('SELECT * FROM watch_history WHERE profile_id = $<profileId> ORDER BY watch_date DESC LIMIT 1', {
            profileId: profileId
        });

        try {
            const movieWatchHistoryObject = await db.oneOrNone('SELECT * FROM movie_watch_history WHERE watch_history_id = $<watchHistoryId>', {
                watchHistoryId: watchHistoryObject.watch_history_id
            });

            if (watchHistoryObject !== null && watchHistoryObject.event_type === 'End') {
                responder(res, 400, 'error', 'Previous movie watch history has already ended');
                return;
            };

            //Check if the movie watch history matches the movie so you wont be able to start a new movie and end a different movie
            if (watchHistoryObject !== null && movieWatchHistoryObject.movie_id !== Number(movieId)) {
                console.log(movieWatchHistoryObject.movie_id, movieId, watchHistoryObject !== null, movieWatchHistoryObject.movie_id !== movieId);
                responder(res, 400, 'error', 'Previous movie watch history does not match the movie');
                return;
            };

        } catch (err) {
            console.log(err);
            responder(res, 500, 'error', 'Internal server error');
            return;
        }
    } catch (err) {
        console.log(err);
        responder(res, 500, 'error', 'Internal server error');
        return;
    };

    //Check if endTime is not longer than movie duration
    try {
        const movieDuration = await db.one('SELECT duration FROM movie WHERE movie_id = ${movieId}', {
            movieId: movieId
        });

        if (endTime > movieDuration.duration) {
            responder(res, 400, 'error', 'End time is longer than movie duration');
            return;
        }
    } catch (err) {
        responder(res, 500, 'error', 'Internal server error');
        return;
    }

    //Create new movie watch entry
    try {
        await db.tx(async t => {
            const movieObject = await t.one('SELECT *, TO_CHAR(duration, \'HH24:MI:SS\') AS formatted_duration FROM movie WHERE movie_id = $1', [movieId]);

            // Access the formatted duration from the result
            const formattedDuration = movieObject.formatted_duration;

            const finished: boolean = endTime === movieObject.formatted_duration ? true : false;

            const languageSettings = await t.oneOrNone('SELECT language FROM profile WHERE profile_id = ${profileId}', {
                profileId: profileId
            });

            const watchHisoryObject = await t.one('INSERT INTO watch_history (profile_id, event_type, finished) VALUES ($<profileId>, $<eventType>, $<finished>) RETURNING watch_history_id', {
                profileId: profileId,
                eventType: 'End',
                finished: finished
            });

            await t.none('INSERT INTO movie_watch_history (movie_id,  pause_time, language_settings, watch_history_id) VALUES ($<movieId>, $<pauseTime>, $<languageSettings>, $<watchHistoryId>)', {
                movieId: movieId,
                pauseTime: endTime,
                languageSettings: languageSettings.language,
                watchHistoryId: watchHisoryObject.watch_history_id,
            });
        });
        responder(res, 201, 'success', 'Movie watch history created');
        return;
    } catch (err) {
        console.log(err);
        responder(res, 500, 'error', 'Internal server error');
        return;
    }
};

export const getWatchMovie = async (req: Request & { user?: User }, res: Response): Promise<void> => {

    const movieId: string = req.params.movieId!;

    //Make sure parameters are sumbitted
    if (!req.params.movieId) {
        responder(res, 400, 'error', 'ID parameters are required');
        return;
    }

    //Make sure parameters are numbers
    if (isNaN(Number(movieId))) {
        responder(res, 400, 'error', 'Invalid Request');
        return;
    }

    //Make sure parameters are valid numbers
    if (!validateNumbers([(Number(movieId))])) {
        responder(res, 400, 'error', 'Invalid Request');
        return;
    }

    //Check if movie exists
    try {
        const movieObject = await db.oneOrNone('SELECT * FROM Movie WHERE movie_id = ${movieId}', {
            movieId: movieId
        });

        if (movieObject === null) {
            responder(res, 400, 'error', 'Content not found');
            return;
        }
    } catch (err) {
        responder(res, 500, 'error', 'Internal server error');
        return;
    }

    try {

        const movieObject = await db.oneOrNone('SELECT * FROM Movie WHERE movie_id = ${movieId}', {
            movieId: movieId
        });

        responder(res, 200, 'success', movieObject);
        return;

    } catch (err) {
        console.log(err);
        responder(res, 500, 'error', 'Internal server error');
        return;
    }
};

export const getWatchMovieSubtitle = async (req: Request & { user?: User }, res: Response): Promise<void> => {

    const movieId: string = req.params.movieId!;
    const subtitleLanguage: string = req.query.language! ? req.query.language!.toString() : 'English'; //if user does not specify language then default to English


    //Check if language is valid
    if (!languageValidator(subtitleLanguage)) {
        responder(res, 400, 'error', 'Invalid Request');
        return;
    }

    //Make sure parameters are sumbitted
    if (!req.params.movieId) {
        responder(res, 400, 'error', 'ID parameters are required');
        return;
    }

    //Make sure parameters are numbers
    if (isNaN(Number(movieId))) {
        responder(res, 400, 'error', 'Invalid Request');
        return;
    }

    //Make sure parameters are valid numbers
    if (!validateNumbers([(Number(movieId))])) {
        responder(res, 400, 'error', 'Invalid Request');
        return;
    }

    //Check if movie exists
    try {
        const movieObject = await db.oneOrNone('SELECT * FROM Movie WHERE movie_id = ${movieId}', {
            movieId: movieId
        });

        if (movieObject === null) {
            responder(res, 400, 'error', 'Content not found');
            return;
        }
    } catch (err) {
        responder(res, 500, 'error', 'Internal server error');
        return;
    }

    try {

        const movieObject = await db.oneOrNone('SELECT * FROM Movie WHERE movie_id = ${movieId}', {
            movieId: movieId
        });

        await db.tx(async (t) => {
        });

        try {
            const subtitleObject = await db.one(
                `SELECT s.subtitle_location
                     FROM available_languages AS al
                     JOIN subtitle AS s ON s.subtitle_id = al.subtitle_id
                     JOIN languages AS l ON l.language_id = al.language_id
                     WHERE l.language_name = $<languageName> AND al.movie_id = $<movieId>
                     `, {
                languageName: subtitleLanguage,
                movieId: movieId
            })

            responder(res, 200, 'movieObject', movieObject, 'subtitleLocation', subtitleObject.subtitle_location);
            return;

        } catch (err) {
            console.log(err);
            responder(res, 500, 'error', 'Internal server error');
            return;
        }
    } catch (err) {
        console.log(err);
        responder(res, 500, 'error', 'Internal server error');
        return;
    }

};

export const postStartWatchSeries = async (req: Request & { user?: User }, res: Response): Promise<void> => {

    const profileId: string = req.params.profileId!;
    const seriesId: number = req.body.seriesId!;
    const seasonId: number = req.body.seasonId!;
    const episodeId: number = req.body.episodeId!;

    //Make sure parameters are sumbitted
    if (!req.params.profileId || !req.body.seriesId || !req.body.seasonId || !req.body.episodeId) {
        responder(res, 400, 'error', 'ID parameters are required');
        return;
    };

    //Make sure profileId is a number
    if (isNaN(Number(profileId))) {
        responder(res, 400, 'error', 'Invalid Request');
    };

    //Make sure valid Numbers
    if (!validateNumbers([Number(profileId), seriesId, seasonId, episodeId])) {
        responder(res, 400, 'error', 'Invalid Request');
    };

    //Check if profile exists and if it matches the user
    try {
        const profileObject = await db.oneOrNone('SELECT * FROM Profile WHERE profile_id = ${profileId} AND account_id = ${accountId}', {
            profileId: profileId,
            accountId: req.user!.account_id
        });

        if (profileObject === null) {
            responder(res, 401, 'error', 'Unauthorized');
            return;
        }
    } catch (err) {
        console.log(err);
        responder(res, 500, 'error', 'Internal server error');
        return;
    }

    //Check if series exists
    try {
        const seriesObject = await db.oneOrNone('SELECT * FROM Series WHERE series_id = ${seriesId}', {
            seriesId: seriesId
        });

        if (seriesObject === null) {
            responder(res, 400, 'error', 'Content not found');
            return;
        }
    } catch (err) {
        console.log(err);
        responder(res, 500, 'error', 'Internal server error');
        return;
    }

    //Check if season exists
    try {
        console.log('here', seasonId);
        const seasonObject = await db.oneOrNone('SELECT * FROM Season WHERE season_id = ${seasonId}', {
            seasonId: seasonId
        });
        console.log(seasonObject);

        if (seasonObject === null) {
            responder(res, 400, 'error', 'Content not found');
            return;
        }
    } catch (err) {
        console.log(err);
        responder(res, 500, 'error', 'Internal server error');
        return;
    }

    //Check if episode exists
    try {
        const episodeObject = await db.oneOrNone('SELECT * FROM Episode WHERE episode_id = ${episodeId}', {
            episodeId: episodeId
        });

        if (episodeObject === null) {
            responder(res, 400, 'error', 'Content not found');
            return;
        }
    } catch (err) {
        console.log(err);
        responder(res, 500, 'error', 'Internal server error');
        return;
    }

    //Check if the latest series watch history has event_type "End" in watch_history
    try {
        const watchHistoryObject = await db.oneOrNone('SELECT * FROM watch_history WHERE profile_id = $<profileId> ORDER BY watch_date DESC LIMIT 1', {
            profileId: profileId
        });

        if (watchHistoryObject !== null && watchHistoryObject.event_type === 'Start') {
            responder(res, 400, 'error', 'Previous contents watch history has not ended yet');
            return;
        }
    } catch (err) {
        console.log(err);
        responder(res, 500, 'error', 'Internal server error');
    }

    //Check if in the watch history has any series watch history entries through multiple seasons and episodes is yes retrieve the latest one

    try {
        //join two tables and get the latest watch history entry
        const watchHistoryObject = await db.oneOrNone(`
        SELECT *
        FROM watch_history AS wh
        JOIN series_watch_history AS swh ON swh.watch_history_id = wh.watch_history_id
        WHERE wh.profile_id = $<profileId> AND swh.series_id = $<seriesId> AND swh.season_id = $<seasonId> AND swh.episode_id = $<episodeId>
        ORDER BY wh.watch_date DESC LIMIT 1
        `, {
            profileId: profileId,
            seriesId: seriesId,
            seasonId: seasonId,
            episodeId: episodeId
        });


        //If there is watch history entry then check if the series watch history entry is finished
        if (watchHistoryObject !== null && watchHistoryObject.event_type === 'Start') {
            responder(res, 400, 'error', 'Previous contents watch history has not ended yet');
            return;
        }

        //if there is watch history entry check if it has not finished then start the series from the same timestamp
        if (watchHistoryObject !== null && watchHistoryObject.finished === false) {

            try {
                await db.tx(async t => {

                    const languageSettings = await t.oneOrNone('SELECT language FROM profile WHERE profile_id = ${profileId}', {
                        profileId: profileId
                    });        

                    const startTime = await t.one('SELECT pause_time FROM series_watch_history WHERE watch_history_id = ${watchHistoryId}', {
                        watchHistoryId: watchHistoryObject.watch_history_id
                    });

                    const watchHisoryObject = await t.one('INSERT INTO watch_history (profile_id, event_type, finished) VALUES ($<profileId>, $<eventType>, $<finished>) RETURNING watch_history_id', {
                        profileId: profileId,
                        eventType: 'Start',
                        finished: false
                    })

                    await t.none('INSERT INTO series_watch_history (series_id, season_id, episode_id, pause_time, watch_history_id, language_settings) VALUES ($<seriesId>, $<seasonId>, $<episodeId>, $<pauseTime>, $<watchHistoryId>, $<languageSettings>)', {
                        seriesId: seriesId,
                        seasonId: seasonId,
                        episodeId: episodeId,
                        pauseTime: startTime.pause_time,
                        watchHistoryId: watchHisoryObject.watch_history_id,
                        languageSettings: languageSettings.language
                    });
                });

                responder(res, 201, 'success', 'Series watch history created');
                return;
            } catch (err) {
                console.log(err);
                responder(res, 500, 'error', 'Internal server error');
                return;
            }
        }

        if(watchHistoryObject !== null && watchHistoryObject.finished === true){
            try {
                await db.tx(async t => {

                    const languageSettings = await t.oneOrNone('SELECT language FROM profile WHERE profile_id = ${profileId}', {
                        profileId: profileId
                    }); 

                    const watchHisoryObject = await t.one('INSERT INTO watch_history (profile_id, event_type, finished) VALUES ($<profileId>, $<eventType>, $<finished>) RETURNING watch_history_id', {
                        profileId: profileId,
                        eventType: 'Start',
                        finished: false
                    });

                    await t.none('INSERT INTO series_watch_history (series_id, season_id, episode_id, pause_time, watch_history_id, language_settings) VALUES ($<seriesId>, $<seasonId>, $<episodeId>, $<pauseTime>, $<watchHistoryId>, $<language_settings>)', {
                        seriesId: seriesId,
                        seasonId: seasonId,
                        episodeId: episodeId,
                        pauseTime: '00:00:00',
                        watchHistoryId: watchHisoryObject.watch_history_id,
                        language_settings: languageSettings.language
                    });
                });

                responder(res, 201, 'success', 'Series watch history created');
                return;
            } catch (err) {
                console.log(err);
                responder(res, 500, 'error', 'Internal server error');
                return;
            }
        }



    } catch (err) {
        console.log(err);
        responder(res, 500, 'error', 'Internal server error');
        return;
    }

    responder(res, 200, 'success', 'Series watch history created');

};

export const postEndWatchSeries = async (req: Request & { user?: User }, res: Response): Promise<void> => {
};

export const getWatchSeries = async (req: Request & { user?: User }, res: Response): Promise<void> => {
};

export const getWatchSeriesSubtitle = async (req: Request & { user?: User }, res: Response): Promise<void> => {
};

export const getProfileWatchHistory = async (req: Request & { user?: User }, res: Response): Promise<void> => {
};

export const getProfilePersonalOffer = async (req: Request & { user?: User }, res: Response): Promise<void> => {
};

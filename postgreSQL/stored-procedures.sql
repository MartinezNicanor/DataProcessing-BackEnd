-- netflix database stored procedures

-- revokes all right to a given user
CREATE OR REPLACE FUNCTION revoke_all_privileges(user_group text)
RETURNS void AS $$
    DECLARE
        current_table_name text;
    BEGIN
        FOR current_table_name IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE')
        LOOP
            EXECUTE 'REVOKE ALL ON TABLE ' || current_table_name || ' FROM ' || user_group;
        END LOOP;
    END
$$ LANGUAGE plpgsql;

-- Add a movie and make it available in a country
CREATE OR REPLACE FUNCTION add_and_publish_movie(movie_title text,movie_duration text, genre text, country text, language text, subtitle_path text)
RETURNS void AS $$
    DECLARE
        custom_error_message TEXT;
        country_id int;
        genre_id int;
        language_id int;
        movie_id int;
        subtitle_id int;
    BEGIN -- We chose SERIALIZABLE because ...
        SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; -- https://mkdev.me/posts/transaction-isolation-levels-with-postgresql-as-an-example

        -- Getters
        country_id = (SELECT country_id FROM country WHERE country_name = country);
        genre_id  = (SELECT genre_id FROM genre WHERE title = genre);
        language_id = (SELECT language_id FROM languages WHERE language_name = language);

        -- Movie table
        INSERT INTO movie (title, duration, genre_id)
        VALUES
            (movie_title, movie_duration, genre_id)
        RETURNING movie_id INTO movie_id;

        -- Available_show_country table
        INSERT INTO available_shows_country (country_id, movie_id)
        VALUES
            (country_id,movie_id);

        -- Subtitle table
        INSERT INTO subtitle (subtitle_location)
        VALUES
            (subtitle_path)
        RETURNING subtitle_id INTO subtitle_id;

        -- Available_language table
        INSERT INTO available_languages (movie_id,language_id, subtitle_id)
        VALUES
            (movie_id,language_id, subtitle_id);

        COMMIT;

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS custom_error_message = MESSAGE_TEXT;
            ROLLBACK;
            RAISE EXCEPTION 'Error: %', custom_error_message;

    END
$$ LANGUAGE plpgsql;

-- function for trigger: check for profile account limit is 4
CREATE OR REPLACE FUNCTION check_unique_account_limit()
RETURNS TRIGGER AS $$
    BEGIN
        IF (
            SELECT COUNT(*)
            FROM profile
            WHERE account_id = NEW.account_id
        ) > 4 THEN
            RAISE EXCEPTION 'More than 4 profiles for the same account are not allowed';
        END IF;
        RETURN NEW;
    END
$$ LANGUAGE plpgsql;

-- output personal watchlist
CREATE OR REPLACE FUNCTION get_personal_watchlist(profile int)
RETURNS SETOF record AS $$
    BEGIN
        SELECT p.profile_name, wh.watch_history_id, wh.watch_date, wh.event_type, wh.finished,(SELECT title FROM movie WHERE movie.movie_id = mwh.movie_id) AS Movie, mwh.pause_time, (SELECT title FROM series s WHERE s.title = swh.series_id) AS Series, (SELECT title FROM season s WHERE s.season_id = swh.season_id) AS Season, (SELECT title FROM episode e WHERE e.episode_id = swh.episode_id) AS Episode, swh.pause_time
        FROM watch_history wh
        INNER JOIN profile p ON wh.profile_id = p.profile_id
        LEFT JOIN movie_watch_history mwh ON wh.watch_history_id = mwh.watch_history_id
        LEFT JOIN series_watch_history swh ON wh.watch_history_id = swh.watch_history_id
        WHERE wh.profile_id = profile;
    END;
$$ LANGUAGE plpgsql;

-- functions used in the API endpoints
-- example on how to call the function 'SELECT * FROM get_watch_count_movie(1)
CREATE OR REPLACE FUNCTION get_watch_count_movie(profile int)
RETURNS TABLE
    (
        profile_name varchar(50),
        movie_title VARCHAR(255),
        movie_count bigint,
        movie_duration interval
    ) AS $$
    BEGIN
        RETURN QUERY
            SELECT p.profile_name, (SELECT title FROM movie WHERE movie.movie_id = mwh.movie_id) AS Movie, (count(mwh.movie_id)) AS Movie_count, (SELECT duration FROM movie WHERE movie.movie_id = mwh.movie_id) AS Movie_duration
            FROM watch_history wh
            INNER JOIN profile p ON wh.profile_id = p.profile_id
            LEFT JOIN movie_watch_history mwh ON wh.watch_history_id = mwh.watch_history_id
            WHERE wh.profile_id = profile AND
                  (mwh.movie_id IN (SELECT DISTINCT mwh.movie_id FROM movie_watch_history))
            GROUP BY p.profile_id, mwh.movie_id;
    END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_watch_count_series(profile int)
RETURNS TABLE
    (
        profile_name varchar(50),
        series_title VARCHAR(255),
        season_title VARCHAR(255),
        episode_title VARCHAR(255),
        episode_count bigint,
        series_duration interval
    ) AS $$
BEGIN
    RETURN QUERY
    SELECT p.profile_name, s.title AS series_title, sea.title AS season_title, e.title AS episode_title, COUNT(e.episode_id) AS episode_count, SUM(e.duration) AS series_total_duration
    FROM watch_history wh
    INNER JOIN profile p ON wh.profile_id = p.profile_id
    LEFT JOIN series_watch_history swh ON wh.watch_history_id = swh.watch_history_id
    LEFT JOIN episode e ON swh.episode_id = e.episode_id
    LEFT JOIN season sea ON e.season_id = sea.season_id
    LEFT JOIN series s ON sea.series_id = s.series_id
    WHERE wh.profile_id = profile AND
          s.series_id IN (SELECT DISTINCT swh.series_id FROM series_watch_history swh WHERE swh.season_id IN (SELECT DISTINCT season_id FROM series_watch_history) AND swh.episode_id IN (SELECT DISTINCT episode_id FROM series_watch_history))
    GROUP BY p.profile_name, s.title, sea.title, e.title;

END
$$ LANGUAGE plpgsql;


-- Insert the user information into DB
CREATE OR REPLACE FUNCTION newAccount(account_id text, profile_name text, profile_image text, age int, language text)
RETURNS void AS $$
    BEGIN
        INSERT INTO profile (account_id, profile_name, profile_image, age, language) VALUES (account_id, profile_name, profile_image, age, language);
    END
$$ LANGUAGE plpgsql;
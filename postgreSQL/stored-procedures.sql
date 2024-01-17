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
    END $$ LANGUAGE plpgsql;

-- Add a movie and make it available in a country
CREATE OR REPLACE FUNCTION add_and_publish_movie(movie_title text,movie_duration text, genre text, country text, language text, subtitle_path text)
RETURNS void AS $$
    DECLARE
        custom_error_message TEXT;
        country_id int;
        genre_id int;
        language_id int;
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

    END $$ LANGUAGE plpgsql;

-- function for trigger: check for profile account limit is 4
CREATE OR REPLACE FUNCTION check_unique_account_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF (
        SELECT COUNT(*)
        FROM Profile
        WHERE account_id = NEW.account_id
    ) > 4 THEN
        RAISE EXCEPTION 'More than 4 profiles for the same account are not allowed';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- output personal watchlist

-- controller/user.ts stored procedures

-- Insert the user information into DB
CREATE OR REPLACE FUNCTION newAccount(account_id text, profile_name text, profile_image text, age int, language text)
RETURNS void AS $$
    BEGIN
        INSERT INTO profile (account_id, profile_name, profile_image, age, language) VALUES (account_id, profile_name, profile_image, age, language);
    END
    $$ LANGUAGE plpgsql;
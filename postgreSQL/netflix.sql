-- v1.0 creating script for tables in Netflx


CREATE TABLE Country (
    country_id SERIAL PRIMARY KEY,
    country_name VARCHAR (255)
);

CREATE TABLE Episode (
    episode_id SERIAL PRIMARY KEY,
    title VARCHAR (255) UNIQUE,
    duration INTERVAL DEFAULT '00:00:00',
    season_id INT NOT NULL
);

CREATE TABLE Genre (
    genre_id SERIAL PRIMARY KEY,
    title VARCHAR (255) NOT NULL UNIQUE
);

CREATE TABLE Languages (
    language_id SERIAL PRIMARY KEY,
    language_name VARCHAR (255) NOT NULL UNIQUE
);

CREATE TABLE Account (
    account_id SERIAL PRIMARY KEY,
    email VARCHAR (255) NOT NULL UNIQUE,
    password VARCHAR (255) NOT NULL,
    profile_id INT NOT NULL,
    first_name VARCHAR (255) NOT NULL,
    last_name VARCHAR (255) NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('PayPal','Visa','MasterCard','Apple Pay','Google Pay','iDEAL')),
    subscription_id INT NOT NULL,
    blocked BOOLEAN NOT NULL,
    street VARCHAR (255) NOT NULL,
    zip_code VARCHAR (10) NOT NULL,
    country_id INT NOT NULL,
    FOREIGN KEY (country_id) REFERENCES Country (country_id) ON DELETE NO ACTION
);

CREATE TABLE Movie (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR (255) NOT NULL UNIQUE,
    duration INTERVAL DEFAULT '00:00:00',
    genre_id INT NOT NULL,
    FOREIGN KEY (genre_id) REFERENCES Genre (genre_id) ON DELETE NO ACTION
);

CREATE TABLE Profile (
    profile_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    profile_image VARCHAR (255) DEFAULT 'location/placeholder.jpg',
    profile_child BOOLEAN DEFAULT false,
    FOREIGN KEY (account_id) REFERENCES Account (account_id) ON DELETE CASCADE
);

CREATE TABLE Rating(
    rating_id SERIAL PRIMARY KEY,
    movie_id INT,
    series_id INT,
    user_rating INT CHECK (user_rating BETWEEN 1 AND 5)
);

CREATE TABLE Season (
    season_id SERIAL PRIMARY KEY,
    series_id INT NOT NULL,
    title VARCHAR (255)
);

CREATE TABLE Series (
    series_id SERIAL PRIMARY KEY,
    title VARCHAR (255) NOT NULL,
    genre_id INT NOT NULL,
    FOREIGN KEY (genre_id) REFERENCES Genre (genre_id) ON DELETE NO ACTION
);

CREATE TABLE Subscription (
    subscription_id SERIAL PRIMARY KEY,
    title VARCHAR (255) NOT NULL,
    description TEXT NOT NULL,
    subscription_price FLOAT NOT NULL DEFAULT 7.99
);

CREATE TABLE Subtitle (
    subtitle_id SERIAL PRIMARY KEY,
    subtitle_location VARCHAR (255) DEFAULT 'location/subtitle.txt'
);

CREATE TABLE Available_languages (
    available_language_id SERIAL PRIMARY KEY,
    movie_id INT,
    series_id INT,
    language_id INT NOT NULL,
    subtitle_id INT,
    FOREIGN KEY (movie_id) REFERENCES Movie (movie_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (series_id) REFERENCES Series (series_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (language_id) REFERENCES Languages (language_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (subtitle_id) REFERENCES Subtitle (subtitle_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Movie_watch_history (
    movie_watch_history_id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL,
    pause_time INTERVAL DEFAULT '00:00:00',
    set_language_id INT NOT NULL,
    set_subtitle_id INT,
    FOREIGN KEY (movie_id) REFERENCES Movie (movie_id) ON DELETE CASCADE
);

CREATE TABLE Series_watch_history (
    series_watch_history_id SERIAL PRIMARY KEY,
    episode_id INT NOT NULL,
    pause_time INTERVAL DEFAULT '00:00:00',
    set_language_id INT NOT NULL,
    set_subtitle_id INT,
    FOREIGN KEY (episode_id) REFERENCES Episode (episode_id) ON DELETE CASCADE
);

CREATE TABLE Watch_history (
    watch_history_id SERIAL PRIMARY KEY,
    profile_id INT NOT NULL,
    movie_watch_history_id INT UNIQUE,
    series_watch_history_id INT UNIQUE,
    finished BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY (profile_id) REFERENCES Profile (profile_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_watch_history_id) REFERENCES Movie_watch_history (movie_watch_history_id) ON DELETE CASCADE,
    FOREIGN KEY (series_watch_history_id) REFERENCES Series_watch_history (series_watch_history_id) ON DELETE CASCADE
);

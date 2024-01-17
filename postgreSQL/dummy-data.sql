-- 1.0 Dummy data for netflix database for testing the database connection with TypeScript

INSERT INTO Country (country_name) VALUES
('United States'),
('Canada'),
('Germany'),
('Japan'),
('Australia');


-- Subscription table dummy data
INSERT INTO public.subscription (subscription_id, title, description, subscription_price) VALUES (0, 'free', 'free', 0);
INSERT INTO public.subscription (subscription_id, title, description, subscription_price) VALUES (1, 'sd', 'sd', 7.99);
INSERT INTO public.subscription (subscription_id, title, description, subscription_price) VALUES (2, 'hd', 'hd', 10.99);
INSERT INTO public.subscription (subscription_id, title, description, subscription_price) VALUES (3, 'uhd', 'uhd', 13.99);

--Add Genre dummy data

INSERT INTO public.genre (genre_id, title) VALUES (10, 'Documentary');
INSERT INTO public.genre (genre_id, title) VALUES (11, 'Drama');
INSERT INTO public.genre (genre_id, title) VALUES (12, 'Action');
INSERT INTO public.genre (genre_id, title) VALUES (13, 'Adventure');
INSERT INTO public.genre (genre_id, title) VALUES (14, 'Comedy');
INSERT INTO public.genre (genre_id, title) VALUES (15, 'Horror');
INSERT INTO public.genre (genre_id, title) VALUES (16, 'Thriller');



-- 10 - Documentary, 11 - Drama, 12 - Action, 13 - Adventure, 14 - Comedy, 15 - Horror, 16 - Thriller

0 years 0 mons 0 days 3 hours 30 mins 0.0 secs

INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (2, 'John Cena Documentary', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 10);
INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (3, 'The Rock Documentary', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 10);
INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (4, 'The Undertaker Documentary', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 10);
INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (5, 'The Miz Documentary', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 10);

INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (6, 'The Shawsank Redemption', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 11);
INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (7, 'The Godfather', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 11);
INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (23, 'The Godfather: Part II', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 11);


INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (8, 'The Dark Knight', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 12);
INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (10, 'The Matrix', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 12);
INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (1, 'Tomorrow', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 12);

INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (12, 'The Lord of the Rings: The Fellowship of the Ring', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 13);
INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (13, 'The Lord of the Rings: The Two Towers', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 13);
INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (14, 'The Lord of the Rings: The Return of the King', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 13);

INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (15, 'The Hangover', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 14);
INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (16, 'The Hangover Part II', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 14);
INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (17, 'The Hangover Part III', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 14);
INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (18, 'The Hangover Part IV', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 14);

INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (19, 'The Conjuring', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 15);
INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (20, 'The Conjuring 2', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 15);
INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (21, 'IT', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 15);
INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (22, 'IT Chapter Two', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 15);

INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (9, 'Inception', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 16);
INSERT INTO public.movie (movie_id, title, duration, genre_id) VALUES (11, 'The Prestige', '0 years 0 mons 0 days 3 hours 30 mins 0.0 secs', 16);



INSERT INTO public.series (series_id, title, genre_id) VALUES (1, 'The Office', 14);
INSERT INTO public.series (series_id, title, genre_id) VALUES (2, 'Friends', 14);
INSERT INTO public.series (series_id, title, genre_id) VALUES (3, 'Breaking Bad', 11);
INSERT INTO public.series (series_id, title, genre_id) VALUES (4, 'Game of Thrones', 13);
INSERT INTO public.series (series_id, title, genre_id) VALUES (5, 'The Walking Dead', 15);
INSERT INTO public.series (series_id, title, genre_id) VALUES (6, 'The Big Bang Theory', 14);

INSERT INTO public.season (season_id, series_id, title) VALUES (1, 1, 'Season 1');
INSERT INTO public.season (season_id, series_id, title) VALUES (2, 1, 'Season 2');
INSERT INTO public.season (season_id, series_id, title) VALUES (3, 1, 'Season 3');
INSERT INTO public.season (season_id, series_id, title) VALUES (4, 1, 'Season 4');

INSERT INTO public.season (season_id, series_id, title) VALUES (5, 2, 'Season 1');
INSERT INTO public.season (season_id, series_id, title) VALUES (6, 2, 'Season 2');
INSERT INTO public.season (season_id, series_id, title) VALUES (7, 2, 'Season 3');
INSERT INTO public.season (season_id, series_id, title) VALUES (8, 2, 'Season 4');

INSERT INTO public.season (season_id, series_id, title) VALUES (9, 3, 'Season 1');
INSERT INTO public.season (season_id, series_id, title) VALUES (10, 3, 'Season 2');
INSERT INTO public.season (season_id, series_id, title) VALUES (11, 3, 'Season 3');
INSERT INTO public.season (season_id, series_id, title) VALUES (12, 3, 'Season 4');

INSERT INTO public.season (season_id, series_id, title) VALUES (13, 4, 'Season 1');
INSERT INTO public.season (season_id, series_id, title) VALUES (14, 4, 'Season 2');
INSERT INTO public.season (season_id, series_id, title) VALUES (15, 4, 'Season 3');
INSERT INTO public.season (season_id, series_id, title) VALUES (16, 4, 'Season 4');

INSERT INTO public.season (season_id, series_id, title) VALUES (17, 5, 'Season 1');
INSERT INTO public.season (season_id, series_id, title) VALUES (18, 5, 'Season 2');
INSERT INTO public.season (season_id, series_id, title) VALUES (19, 5, 'Season 3');
INSERT INTO public.season (season_id, series_id, title) VALUES (20, 5, 'Season 4');

INSERT INTO public.season (season_id, series_id, title) VALUES (21, 6, 'Season 1');
INSERT INTO public.season (season_id, series_id, title) VALUES (22, 6, 'Season 2');
INSERT INTO public.season (season_id, series_id, title) VALUES (23, 6, 'Season 3');
INSERT INTO public.season (season_id, series_id, title) VALUES (24, 6, 'Season 4');


INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (1, 1, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (2, 1, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (3, 1, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (4, 1, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (5, 2, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (6, 2, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (7, 2, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (8, 2, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (9, 3, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (10, 3, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (11, 3, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (12, 3, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (13, 4, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (14, 4, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (15, 4, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (16, 4, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (17, 5, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (18, 5, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (19, 5, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (20, 5, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (21, 6, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (22, 6, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (23, 6, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (24, 6, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (25, 7, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (26, 7, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (27, 7, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (28, 7, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (29, 8, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (30, 8, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (31, 8, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (32, 8, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (33, 9, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (34, 9, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (35, 9, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (36, 9, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (37, 10, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (38, 10, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (39, 10, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (40, 10, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (41, 11, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (42, 11, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (43, 11, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (44, 11, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (45, 12, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (46, 12, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (47, 12, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (48, 12, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (49, 13, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (50, 13, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (51, 13, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (52, 13, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (53, 14, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (54, 14, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (55, 14, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (56, 14, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (57, 15, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (58, 15, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (59, 15, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (60, 15, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (61, 16, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (62, 16, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (63, 16, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (64, 16, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (65, 17, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (66, 17, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (67, 17, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (68, 17, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (69, 18, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (70, 18, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (71, 18, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (72, 18, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (73, 19, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (74, 19, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (75, 19, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (76, 19, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (77, 20, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (78, 20, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (79, 20, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (80, 20, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (81, 21, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (82, 21, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (83, 21, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (84, 21, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (85, 22, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (86, 22, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (87, 22, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (88, 22, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (89, 23, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (90, 23, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (91, 23, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (92, 23, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (93, 24, 'Episode 1', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (94, 24, 'Episode 2', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (95, 24, 'Episode 3', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');
INSERT INTO public.episode (episode_id, season_id, title, duration) VALUES (96, 24, 'Episode 4', '0 years 0 mons 0 days 0 hours 30 mins 0.0 secs');

INSERT INTO public.subtitle (subtitle_id, subtitle_location) VALUES (9, 'location/nl_sub.txt');
INSERT INTO public.subtitle (subtitle_id, subtitle_location) VALUES (8, 'location/pl_sub.txt');
INSERT INTO public.subtitle (subtitle_id, subtitle_location) VALUES (7, 'location/ru_sub.txt');
INSERT INTO public.subtitle (subtitle_id, subtitle_location) VALUES (6, 'location/hu_sub.txt');
INSERT INTO public.subtitle (subtitle_id, subtitle_location) VALUES (4, 'location/ger_sub.txt');
INSERT INTO public.subtitle (subtitle_id, subtitle_location) VALUES (3, 'location/sp_sub.txt');
INSERT INTO public.subtitle (subtitle_id, subtitle_location) VALUES (2, 'location/fr_sub.txt');
INSERT INTO public.subtitle (subtitle_id, subtitle_location) VALUES (10, 'location/ro_sub.txt');
INSERT INTO public.subtitle (subtitle_id, subtitle_location) VALUES (5, 'location/it_sub.txt');
INSERT INTO public.subtitle (subtitle_id, subtitle_location) VALUES (1, 'location/eng_sub.txt');

INSERT INTO public.languages (language_id, language_name) VALUES (1, 'English');
INSERT INTO public.languages (language_id, language_name) VALUES (2, 'French');
INSERT INTO public.languages (language_id, language_name) VALUES (3, 'Spanish');
INSERT INTO public.languages (language_id, language_name) VALUES (4, 'German');
INSERT INTO public.languages (language_id, language_name) VALUES (5, 'Italian');
INSERT INTO public.languages (language_id, language_name) VALUES (6, 'Hungarian');
INSERT INTO public.languages (language_id, language_name) VALUES (7, 'Russian');
INSERT INTO public.languages (language_id, language_name) VALUES (8, 'Polish');
INSERT INTO public.languages (language_id, language_name) VALUES (9, 'Dutch');
INSERT INTO public.languages (language_id, language_name) VALUES (10, 'Romanian');

INSERT INTO public.available_languages (movie_id, series_id, language_id, subtitle_id)
SELECT
    movie_id,
    NULL,
    language_id,
    language_id
FROM
    generate_series(1, 23) AS movie_id,
    generate_series(1, 10) AS language_id;



INSERT INTO public.available_languages (movie_id, series_id, language_id, subtitle_id)
SELECT
    NULL,
    series_id,
    language_id,
    language_id
FROM
    generate_series(1, 6) AS series_id,
    generate_series(1, 10) AS language_id;
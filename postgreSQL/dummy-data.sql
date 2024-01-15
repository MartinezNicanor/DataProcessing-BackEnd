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




-- Dummy data

-- subscription table
INSERT INTO Subscription(title, description, subscription_price)
VALUES
    ('Free', 'free subscription model', 0.0),
    ('SD', 'SD subscription model', 7.99),
    ('HD', 'HD subscription model', 10.99),
    ('UHD', 'UHD subscription model', 13.99);

-- country table
INSERT INTO Country (country_name)
VALUES
    ('United States'),
    ('Canada'),
    ('Germany'),
    ('Japan'),
    ('Australia');

-- language table
INSERT INTO Languages(language_name)
VALUES
    ('English'),
    ('French'),
    ('German'),
    ('Japanese'),
    ('Dutch');

-- genre table
INSERT INTO Genre (title)
VALUES
    ('Drama'),
    ('Thriller'),
    ('Comedy'),
    ('Horror'),
    ('Documentary');

-- movie table
INSERT INTO Movie (title, duration, genre_id)
VALUES
    ('Tenet', '02:10:15', 2),
    ('New kids turbo', '01:30:10', 3),
    ('Oppenheimer', '3:01:00', 1),
    ('Barbie', '2:45:50', 3);

-- series table
INSERT INTO Series (title, genre_id)
VALUES
    ('Peaky blinders', 1),
    ('Dragonball', 4),
    ('Spongebob', 3);

-- season table
INSERT INTO Season (series_id, title)
VALUES
    (0,'Tommy Shelby'),
    (0,'Arthur Shelby'),
    (0,'Polly Gray'),
    (2,'He has pants'),
    (2,'He has pants part 2');

-- episode table
INSERT INTO Episode (title, duration, season_id)
VALUES
    ('1', '00:59:15',1),
    ('2', '00:42:15',1),
    ('1', '00:19:15',2),
    ('1', '00:39:15',3),
    ('2', '00:59:15',3),
    ('1', '00:42:15',4),
    ('2', '00:19:15',4),
    ('3', '00:39:15',4),
    ('1', '00:59:15',5),
    ('2', '00:42:15',5),
    ('3', '00:19:15',5),
    ('4', '00:59:15',5);
-- rating table
INSERT INTO Rating (movie_id, user_rating)
VALUES
    (1,5),
    (1,4.8),
    (1,5),
    (1,4.8),
    (1,5),
    (1,4.8),
    (1,3),
    (2,3.8),
    (2,3),
    (2,3.8),
    (3,1.5),
    (3,1.8);

INSERT INTO Rating (series_id, user_rating)
VALUES
    (1,5),
    (1,4.8),
    (1,5),
    (1,4.8),
    (1,5),
    (1,4.8),
    (1,3),
    (2,3.8),
    (2,3),
    (2,3.8),
    (3,1.5),
    (3,1.8);

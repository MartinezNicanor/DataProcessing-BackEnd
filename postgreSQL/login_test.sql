

CREATE TABLE User (
    account_id SERIAL PRIMARY KEY,
    email VARCHAR (255) NOT NULL UNIQUE,
    password VARCHAR (255) NOT NULL,
    first_name VARCHAR (255) NOT NULL,
    last_name VARCHAR (255) NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('PayPal','Visa','MasterCard','Apple Pay','Google Pay','iDEAL')),
    subscription_id INT NOT NULL,
    blocked BOOLEAN NOT NULL,
    verified BOOLEAN NOT NULL,
    street VARCHAR (255) NOT NULL,
    zip_code VARCHAR (10) NOT NULL,
    country_id INT NOT NULL,
    log_in_attempt_count INT,
    invited BOOLEAN,
);


CREATE TABLE Profile (
    profile_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    profile_image VARCHAR(255) DEFAULT 'location/placeholder.jpg',
    profile_name VARCHAR(255),
    profile_child BOOLEAN DEFAULT false
    age INT NOT NULL,
    preferences JSON NOT NULL DEFAULT '{
        "movie": [], 
        "series": [], 
        "genre": [],
        "min_age": [], 
        "viewing_class": [], 
        }'
    FOREIGN KEY (account_id) REFERENCES Account (account_id) ON DELETE CASCADE,
    
    -- Unique constraint to ensure that account_id is unique within the first four rows
    CONSTRAINT unique_account_limit CHECK (
        (SELECT COUNT(*) FROM Profile WHERE account_id = NEW.account_id) <= 4
    )
);

-- Insert data into the User table
INSERT INTO "User" (
    email, 
    password, 
    first_name, 
    last_name, 
    payment_method, 
    subscription_id, 
    blocked, 
    verified, 
    street, 
    zip_code, 
    country_id, 
    log_in_attempt_count, 
    invited
) VALUES (
    'user1@example.com',
    'password123',
    'John',
    'Doe',
    'Visa',
    123,
    false,
    true,
    '123 Main St',
    '12345',
    1,
    0,
    false
);

-- Insert data into the Profile table
INSERT INTO Profile (
    account_id,
    profile_image,
    profile_name,
    profile_child,
    age,
    preferences
) VALUES (
    1,
    'location/profile1.jpg',
    'JohnDoeProfile',
    false,
    25,
    '{"movie": ["Action", "Comedy"], "series": ["Drama"], "genre": ["Thriller"], "min_age": [18], "viewing_class": ["Violence"]}'
);

-- Add more dummy data for additional profiles
INSERT INTO Profile (
    account_id,
    profile_image,
    profile_name,
    profile_child,
    age,
    preferences
) VALUES (
    1,
    'location/profile2.jpg',
    'JohnDoeProfile2',
    true,
    8,
    '{"movie": ["Animation", "Adventure"], "series": ["Cartoon"], "genre": ["Family"], "min_age": [6], "viewing_class": ["All ages"]}'
);



-- v3.0 creating script for tables in User

CREATE TABLE Roles (
    role_id  SERIAL PRIMARY KEY,
    title VARCHAR (255) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE "User" (
    user_id  SERIAL PRIMARY KEY,
    username VARCHAR (255) NOT NULL UNIQUE,
    user_password VARCHAR (255) NOT NULL,
    first_name VARCHAR (255) NOT NULL,
    last_name VARCHAR (255) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES Roles (role_id) ON DELETE NO ACTION
);

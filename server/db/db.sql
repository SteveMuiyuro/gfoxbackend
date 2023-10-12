CREATE TABLE reviews(
    id BIGSERIAL PRIMARY KEY,
    truckid BIGINT NOT NULL REFERENCES trucks(id),
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    review TEXT NOT NULL,
    rating INT NOT NULL CHECK(rating >=1 AND rating <=5),
    posting_date DATE NOT NULL DEFAULT CURRENT_DATE
);

DROP TABLE reviews;

CREATE TABLE users(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    UNIQUE(email)

);

CREATE TABLE trucks (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    truck_name VARCHAR(50) NOT NULL,
    truck_description TEXT NOT NULL,
    truck_image VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    tonnage INT NOT NULL,
    type VARCHAR(50) NOT NULL
);

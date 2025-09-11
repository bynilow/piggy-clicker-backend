create TABLE person(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    coins FLOAT
);

create TABLE boosts(
    id SERIAL PRIMARY KEY,
    boost_id VARCHAR(255),
    boost_level INTEGER,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES person(id)
);
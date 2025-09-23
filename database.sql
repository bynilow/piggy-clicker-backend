create TABLE person(
    id VARCHAR(255),
    username VARCHAR(255),
    coins FLOAT
);

create TABLE boosts(
    id SERIAL PRIMARY KEY,
    boost_id VARCHAR(255),
    boost_level INTEGER,
    user_id VARCHAR(255)
);

create TABLE sending_history(
    id SERIAL PRIMARY KEY,
    sender_id VARCHAR(255),
    recipient_id VARCHAR(255),
    coins INTEGER,
    datetime TIMESTAMP
);
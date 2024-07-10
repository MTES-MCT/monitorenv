CREATE TABLE user_authorizations (
    hashed_email varchar(200) PRIMARY KEY,
    is_super_user boolean NOT NULL
);

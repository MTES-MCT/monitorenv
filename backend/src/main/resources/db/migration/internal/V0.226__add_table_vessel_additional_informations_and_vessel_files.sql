CREATE TABLE vessels_additional_information
(
    id           SERIAL PRIMARY KEY,
    batch_id     INT NOT NULL,
    observations TEXT,
    row_number   INT NOT NULL,
    ship_id      INT NOT NULL
);

CREATE TABLE vessels_files
(
    id         SERIAL PRIMARY KEY,
    batch_id   INT          NOT NULL,
    content    BYTEA        NOT NULL,
    name       VARCHAR(255) NOT NULL,
    mime_type  VARCHAR(255) NOT NULL,
    row_number INT          NOT NULL,
    ship_id    INT          NOT NULL,
    size       INTEGER      NOT NULL
);
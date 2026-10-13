CREATE TABLE reportings_images
(
    id           SERIAL PRIMARY KEY,
    content      BYTEA        NOT NULL,
    name         VARCHAR(255) NOT NULL,
    mime_type    VARCHAR(255) NOT NULL,
    reporting_id INT          NOT NULL,
    size         INTEGER      NOT NULL
);
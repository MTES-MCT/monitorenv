CREATE TABLE dashboard_images
(
    id           uuid PRIMARY KEY,
    dashboard_id uuid         NOT NULL,
    name         VARCHAR(255) NOT NULL,
    mime_type    VARCHAR(255) NOT NULL,
    content      bytea        NOT NULL,
    size         integer      NOT NULL,
    CONSTRAINT fk_dashboard FOREIGN KEY (dashboard_id) REFERENCES dashboard (id)
);

CREATE INDEX idx_fk_dashboard_id ON dashboard_images (dashboard_id);

ALTER TABLE dashboard
    ADD COLUMN links jsonb

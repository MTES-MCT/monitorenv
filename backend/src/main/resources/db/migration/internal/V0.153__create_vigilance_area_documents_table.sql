CREATE TABLE vigilance_area_images
(
  id serial PRIMARY KEY,
  vigilance_area_id integer NOT NULL,
  image_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(255) NOT NULL,
  content bytea NOT NULL,
  CONSTRAINT fk_vigilance_areas FOREIGN KEY (vigilance_area_id) REFERENCES vigilance_areas (id)
);

CREATE INDEX idx_vigilance_areas_id ON vigilance_area_images (vigilance_area_id);

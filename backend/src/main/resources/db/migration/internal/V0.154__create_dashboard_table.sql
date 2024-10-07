CREATE TABLE dashboard
(
    id   uuid PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE briefing
(
    id                   uuid PRIMARY KEY,
    dashboard_id         uuid NOT NULL,
    reportings_id        integer,
    amp_cacem_id         integer,
    regulations_cacem_id integer,
    vigilance_area_id    integer,
    control_units_id     integer,
    --department code has 3 char max : https://www.insee.fr/fr/information/7766585
    insee_code           varchar(3),
    CONSTRAINT fk_dashboard_id FOREIGN KEY (dashboard_id) REFERENCES dashboard (id),
    CONSTRAINT fk_reportings FOREIGN KEY (reportings_id) REFERENCES reportings (id),
    CONSTRAINT fk_regulatory_cacem FOREIGN KEY (regulations_cacem_id) REFERENCES regulations_cacem (id),
    CONSTRAINT fk_vigilance_area FOREIGN KEY (vigilance_area_id) REFERENCES vigilance_areas (id),
    CONSTRAINT fk_control_units FOREIGN KEY (control_units_id) REFERENCES control_units (id)
);



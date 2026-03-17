CREATE TABLE themes_natinfs
(
    themes_id   INT REFERENCES themes (id),
    natinf_code INT REFERENCES natinfs (natinf_code),
    primary key (themes_id, natinf_code)
);
CREATE TABLE themes_natinfs
(
    themes_id      INT REFERENCES themes (id),
    ref_natinfs_id INT REFERENCES ref_natinfs (id),
    primary key (themes_id, ref_natinfs_id)
);
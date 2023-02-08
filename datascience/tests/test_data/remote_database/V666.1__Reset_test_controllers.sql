DELETE FROM missions_control_resources;
DELETE FROM control_resources;
DELETE FROM missions_control_units;
DELETE FROM control_units;

ALTER SEQUENCE public.control_units_id_seq RESTART WITH 10000;

INSERT INTO public.control_units (
     administration_id,                                     name) VALUES
    (             1005,             'Cultures marines – DDTM 30'),
    (             1005,             'Cultures marines – DDTM 40'),
    (             1005,                          'DML – DDTM 59'),
    (             1005,                                 'DML 2A'),
    (             1005,                          'DPM – DDTM 14'),
    (             1005,                          'DPM – DDTM 35'),
    (             1005,                          'DPM – DDTM 44'),
    (             1005,                                 'SML 33'),
    (             1005,                                 'SML 50'),
    (             1005,             'Police de l''eau – DDTM 11'),
    (             1009,                      'PAM Jeanne Barret'),
    (             1009,                             'PAM Themis'),
    (             1009,                             'Cross Etel'),
    (             1009,                         'Cross Gris Nez'),
    (                2,                            'BGC Ajaccio'),
    (                2,                             'BGC Bastia'),
    (                2,                         'BSN Ste Maxime'),
    (                2,                         'DF 25 Libecciu'),
    (                2,                     'DF 61 Port-de-Bouc'),
    (             1008,                 'DREAL Pays-de-La-Loire'),
    (                4,                            'P602 Verdon'),
    (                6,                              'BN Toulon'),
    (                6,              'Brigade fluviale de Rouen'),
    (             1013,          'Natura 2000 Côte Bleue Marine'),
    (                3,                             'A636 Maïto'),
    (             1011,                              'OFB Sd 85'),
    (             1011,         'OFB SD974 Brigade Nature – SOI'),
    (             1014,       'Parc Naturel Régional Martinique'),
    (               10,            'Parc National de Guadeloupe'),
    (             1006,                         'PNM Martinique'),
    (             1015,         'Police Municipale Le Marin 972'),
    (             1004, 'Réserve Naturelle  de L''Ilot M''Bouzi'),
    (             1004,               'Réserve Naturelle 7 Iles');

ALTER SEQUENCE public.control_resources_id_seq RESTART WITH 1;

INSERT INTO public.control_resources (unit_id, name) VALUES
    (10001, 'Semi-rigide 1'),
    (10001, 'Semi-rigide 2'),
    (10003, 'Semi-rigide 1'),
    (10003, 'Semi-rigide 2'),
    (10003, 'Voiture'),
    (10004, 'AR VECHEN'),
    (10004, 'Semi-rigide'),
    (10011, 'PAM Jeanne Barret'),
    (10012, 'PAM Themis'),
    (10019, 'ALTAIR'),
    (10019, 'PHEROUSA'),
    (10019, 'ARIOLA');



--
-- Add historic control units
--
INSERT INTO public.control_units (
       id, administration_id,                 name, archived) VALUES
    (1315,              1011, 'Unité 1 ancien nom',     true),
    (1485,                 4, 'Unité 3 ancien nom',     true);

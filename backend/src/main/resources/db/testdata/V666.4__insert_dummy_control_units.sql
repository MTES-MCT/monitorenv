INSERT INTO public.control_units
    (   id, administration_id,    archived,                                     name)
VALUES
    (    1,              1005,       false,             'Cultures marines – DDTM 40'),
    (    2,              1005,       false,                          'DML – DDTM 59'),
    (    3,              1005,       false,                                 'DML 2A'),
    (    4,              1005,       false,                          'DPM – DDTM 14'),
    (    5,              1005,       false,                          'DPM – DDTM 35'),
    (    6,              1005,       false,                          'DPM – DDTM 44'),
    (    7,              1005,       false,                                 'SML 33'),
    (    8,              1005,       false,                                 'SML 50'),
    (    9,              1005,       false,             'Police de l''eau – DDTM 11'),
    (   10,              1009,       false,                      'PAM Jeanne Barret'),
    (   11,              1009,       false,                             'PAM Themis'),
    (   12,              1009,       false,                             'Cross Etel'),
    (   13,              1009,       false,                         'Cross Gris Nez'),
    (   14,                 2,        true,                            'BGC Ajaccio'),
    (   15,                 2,        true,                             'BGC Bastia'),
    (   16,                 2,       false,                         'BSN Ste Maxime'),
    (   17,                 2,       false,                         'DF 25 Libecciu'),
    (   18,                 2,       false,                     'DF 61 Port-de-Bouc'),
    (   19,              1008,       false,                 'DREAL Pays-de-La-Loire'),
    (   20,                 4,       false,                            'P602 Verdon'),
    (   21,                 6,       false,                              'BN Toulon'),
    (   22,                 6,       false,              'Brigade fluviale de Rouen'),
    (   23,              1013,       false,          'Natura 2000 Côte Bleue Marine'),
    (   24,                 3,       false,                             'A636 Maïto'),
    (   25,              1011,       false,                              'OFB Sd 85'),
    (   26,              1011,       false,         'OFB SD974 Brigade Nature – SOI'),
    (   27,              1014,       false,       'Parc Naturel Régional Martinique'),
    (   28,                10,       false,            'Parc National de Guadeloupe'),
    (   29,              1006,       false,                         'PNM Martinique'),
    (   30,              1015,       false,         'Police Municipale Le Marin 972'),
    (   31,              1004,       false, 'Réserve Naturelle  de L''Ilot M''Bouzi'),
    (   32,              1004,       false,               'Réserve Naturelle 7 Iles'),
    (   33,              1005,       false,             'Cultures marines – DDTM 30');

SELECT setval('control_units_id_seq', 33, true);

INSERT INTO public.control_unit_contacts
    (   id, control_unit_id,           name)
VALUES
    (    1,               1,    'Contact 1'),
    (    2,               1,    'Contact 2'),
    (    3,               4,    'Contact 3');

SELECT setval('control_unit_contacts_id_seq', 3, true);

INSERT INTO public.control_unit_resources
    (   id,   control_unit_id,                    name, base_id,              type)
VALUES
    (    1,                 1,         'Semi-rigide 1',       1,           'BARGE'),
    (    2,                 1,         'Semi-rigide 2',       1,           'BARGE'),
    (    3,                 3,         'Semi-rigide 1',       2,           'BARGE'),
    (    4,                 3,         'Semi-rigide 2',       2,           'BARGE'),
    (    5,                 3,               'Voiture',       3,    'LAND_VEHICLE'),
    (    6,                 4,             'AR VECHEN',       2,         'FRIGATE'),
    (    7,                 4,           'Semi-rigide',       3,           'BARGE'),
    (    8,                11,     'PAM Jeanne Barret',       3,         'FRIGATE'),
    (    9,                12,            'PAM Themis',       3,         'FRIGATE'),
    (   10,                19,                'ALTAIR',       3,         'FRIGATE'),
    (   11,                19,              'PHEROUSA',       3,         'FRIGATE'),
    (   12,                19,                'ARIOLA',       3,         'FRIGATE');

SELECT setval('control_unit_resources_id_seq', 12, true);

-- We expectionally starts IDs at `10000` to reflect what `V0.061__create_control_units.sql` migration does
-- Previous IDs are reserved to control units imported from legacy Poseidon application
INSERT INTO public.control_units
    (   id, administration_id,    archived,                                     name)
VALUES
    (10000,              1005,       false,             'Cultures marines – DDTM 40'),
    (10001,              1005,       false,                          'DML – DDTM 59'),
    (10002,              1005,       false,                                 'DML 2A'),
    (10003,              1005,       false,                          'DPM – DDTM 14'),
    (10004,              1005,       false,                          'DPM – DDTM 35'),
    (10005,              1005,       false,                          'DPM – DDTM 44'),
    (10006,              1005,       false,                                 'SML 33'),
    (10007,              1005,       false,                                 'SML 50'),
    (10008,              1005,       false,             'Police de l''eau – DDTM 11'),
    (10011,              1009,       false,                             'Cross Etel'),
    (10012,              1009,       false,                         'Cross Gris Nez'),
    (10013,                 2,        true,                            'BGC Ajaccio'),
    (10014,                 2,        true,                             'BGC Bastia'),
    (10015,                 2,       false,                         'BSN Ste Maxime'),
    (10016,                 2,       false,                         'DF 25 Libecciu'),
    (10017,                 2,       false,                     'DF 61 Port-de-Bouc'),
    (10018,              1008,       false,                 'DREAL Pays-de-La-Loire'),
    (10019,                 4,       false,                            'P602 Verdon'),
    (10020,                 6,       false,                              'BN Toulon'),
    (10021,                 6,       false,              'Brigade fluviale de Rouen'),
    (10022,              1013,       false,          'Natura 2000 Côte Bleue Marine'),
    (10023,                 3,       false,                             'A636 Maïto'),
    (10024,              1011,       false,                              'OFB Sd 85'),
    (10025,              1011,       false,         'OFB SD974 Brigade Nature – SOI'),
    (10026,              1014,       false,       'Parc Naturel Régional Martinique'),
    (10027,                10,       false,            'Parc National de Guadeloupe'),
    (10028,              1006,       false,                         'PNM Martinique'),
    (10029,              1015,       false,         'Police Municipale Le Marin 972'),
    (10030,              1004,       false, 'Réserve Naturelle  de L''Ilot M''Bouzi'),
    (10031,              1004,       false,               'Réserve Naturelle 7 Iles'),
    (10032,              1005,       false,             'Cultures marines – DDTM 30'),
    (10033,                22,       true,                          'Unité archivée');

INSERT INTO public.control_units(
    id, administration_id,                    name) VALUES
    (         10121,              1009,     'PAM Jeanne Barret'),
    (         10080,              1009,            'PAM Themis'),
    (         10176,              1005,            'ULAM 35');


SELECT setval('control_units_id_seq', (SELECT max(id) FROM control_units), true);

INSERT INTO public.control_unit_contacts
    (   id, control_unit_id,           name,     email,            phone, is_email_subscription_contact,is_sms_subscription_contact)
VALUES
    (    1,           10000,    'Contact 1', 'email_1', '06 01 xx xx xx',                          true,                      false),
    (    2,           10000,    'Contact 2',      null, '06 02 xx xx xx',                         false,                       true),
    (    3,           10003,    'Contact 3', 'email_3',             null,                         false,                       true);

SELECT setval('control_unit_contacts_id_seq', 3, true);

INSERT INTO public.control_unit_resources
    (   id,   control_unit_id,                    name, base_id,              type, is_archived)
VALUES
    (    1,             10000,         'Semi-rigide 1',       1,           'BARGE',       false),
    (    2,             10000,         'Semi-rigide 2',       1,           'BARGE',       false),
    (    3,             10002,         'Semi-rigide 1',       2,           'BARGE',       false),
    (    4,             10002,         'Semi-rigide 2',       2,           'BARGE',       false),
    (    5,             10002,               'Voiture',       3,             'CAR',       false),
    (    6,             10003,             'AR VECHEN',       2,         'FRIGATE',       false),
    (    7,             10003,           'Semi-rigide',       3,           'BARGE',       false),
    (    8,             10121,     'PAM Jeanne Barret',       3,         'FRIGATE',       false),
    (    9,             10080,            'PAM Themis',       3,         'FRIGATE',       false),
    (   10,             10018,                'ALTAIR',       3,         'FRIGATE',       false),
    (   11,             10018,              'PHEROUSA',       3,         'FRIGATE',       false),
    (   12,             10018,                'ARIOLA',       3,         'FRIGATE',       false),
    (   13,             10000,               'Voiture',       1,             'CAR',        true),
    (   14,             10000,                 'Drône',       2,           'DRONE',       false);

SELECT setval('control_unit_resources_id_seq', 14, true);

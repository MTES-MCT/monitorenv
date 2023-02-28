INSERT INTO public.control_units (
     administration_id,                                     name, archived) VALUES
    (             1005,             'Cultures marines – DDTM 30',    false),
    (             1005,             'Cultures marines – DDTM 40',    false),
    (             1005,                          'DML – DDTM 59',    false),
    (             1005,                                 'DML 2A',    false),
    (             1005,                          'DPM – DDTM 14',    false),
    (             1005,                          'DPM – DDTM 35',    false),
    (             1005,                          'DPM – DDTM 44',    false),
    (             1005,                                 'SML 33',    false),
    (             1005,                                 'SML 50',    false),
    (             1005,             'Police de l''eau – DDTM 11',    false),
    (             1009,                      'PAM Jeanne Barret',    false),
    (             1009,                             'PAM Themis',    false),
    (             1009,                             'Cross Etel',    false),
    (             1009,                         'Cross Gris Nez',    false),
    (                2,                            'BGC Ajaccio',    true),
    (                2,                             'BGC Bastia',    true),
    (                2,                         'BSN Ste Maxime',    false),
    (                2,                         'DF 25 Libecciu',    false),
    (                2,                     'DF 61 Port-de-Bouc',    false),
    (             1008,                 'DREAL Pays-de-La-Loire',    false),
    (                4,                            'P602 Verdon',    false),
    (                6,                              'BN Toulon',    false),
    (                6,              'Brigade fluviale de Rouen',    false),
    (             1013,          'Natura 2000 Côte Bleue Marine',    false),
    (                3,                             'A636 Maïto',    false),
    (             1011,                              'OFB Sd 85',    false),
    (             1011,         'OFB SD974 Brigade Nature – SOI',    false),
    (             1014,       'Parc Naturel Régional Martinique',    false),
    (               10,            'Parc National de Guadeloupe',    false),
    (             1006,                         'PNM Martinique',    false),
    (             1015,         'Police Municipale Le Marin 972',    false),
    (             1004, 'Réserve Naturelle  de L''Ilot M''Bouzi',    false),
    (             1004,               'Réserve Naturelle 7 Iles',    false);

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
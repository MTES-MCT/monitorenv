
INSERT INTO public.control_units
  (   id, control_unit_administration_id, is_archived,           name)
VALUES
  (    1,                          1005,       false,             'Cultures marines – DDTM 30'),
  (    2,                          1005,       false,             'Cultures marines – DDTM 40'),
  (    3,                          1005,       false,                          'DML – DDTM 59'),
  (    4,                          1005,       false,                                 'DML 2A'),
  (    5,                          1005,       false,                          'DPM – DDTM 14'),
  (    6,                          1005,       false,                          'DPM – DDTM 35'),
  (    7,                          1005,       false,                          'DPM – DDTM 44'),
  (    8,                          1005,       false,                                 'SML 33'),
  (    9,                          1005,       false,                                 'SML 50'),
  (   10,                          1005,       false,             'Police de l''eau – DDTM 11'),
  (   11,                          1009,       false,                      'PAM Jeanne Barret'),
  (   12,                          1009,       false,                             'PAM Themis'),
  (   13,                          1009,       false,                             'Cross Etel'),
  (   14,                          1009,       false,                         'Cross Gris Nez'),
  (   15,                             2,        true,                            'BGC Ajaccio'),
  (   16,                             2,        true,                             'BGC Bastia'),
  (   17,                             2,       false,                         'BSN Ste Maxime'),
  (   18,                             2,       false,                         'DF 25 Libecciu'),
  (   19,                             2,       false,                     'DF 61 Port-de-Bouc'),
  (   20,                          1008,       false,                 'DREAL Pays-de-La-Loire'),
  (   21,                             4,       false,                            'P602 Verdon'),
  (   22,                             6,       false,                              'BN Toulon'),
  (   23,                             6,       false,              'Brigade fluviale de Rouen'),
  (   24,                          1013,       false,          'Natura 2000 Côte Bleue Marine'),
  (   25,                             3,       false,                             'A636 Maïto'),
  (   26,                          1011,       false,                              'OFB Sd 85'),
  (   27,                          1011,       false,         'OFB SD974 Brigade Nature – SOI'),
  (   28,                          1014,       false,       'Parc Naturel Régional Martinique'),
  (   29,                            10,       false,            'Parc National de Guadeloupe'),
  (   30,                          1006,       false,                         'PNM Martinique'),
  (   31,                          1015,       false,         'Police Municipale Le Marin 972'),
  (   32,                          1004,       false, 'Réserve Naturelle  de L''Ilot M''Bouzi'),
  (   33,                          1004,       false,               'Réserve Naturelle 7 Iles');

SELECT setval('control_units_id_seq', 33, true);

INSERT INTO public.control_unit_contacts
  (   id, control_unit_id,           name)
VALUES
  (    1,              25,    'Contact 1'),
  (    2,              25,    'Contact 2'),
  (    3,              15,    'Contact 3');

SELECT setval('control_unit_contacts_id_seq', 3, true);

INSERT INTO public.control_unit_resources
  (   id, control_unit_id,           name, port_id,         type)
VALUES
  (    1,              25,      'Moyen 1',       1,      'BARGE'),
  (    2,              25,      'Moyen 2',       1,      'BARGE'),
  (    3,              25,      'Moyen 3',       2,    'FRIGATE'),
  (    4,              15,      'Moyen 4',       1,    'FRIGATE');

SELECT setval('control_unit_resources_id_seq', 4, true);

INSERT INTO public.bases
  (   id,           name,  latitude, longitude)
VALUES
  (    1,    'Marseille', 43.295765,  5.375486),
  (    2,   'Saint-Malo', 48.648105, -2.013144),
  (    3,    'Dunkerque', 51.035534,  2.372845);

SELECT setval('bases_id_seq', 3, true);

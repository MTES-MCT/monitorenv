INSERT INTO public.bases
  (   id,           name)
VALUES
  (    1,    'Marseille'),
  (    2,   'Saint-Malo'),
  (    3,    'Dunkerque');

SELECT setval('bases_id_seq', 3, true);

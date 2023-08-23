INSERT INTO public.bases
  (   id,           name)
VALUES
  (    1,    'Marseille'),
  (    2,   'Saint-Malo');

SELECT setval('bases_id_seq', 2, true);

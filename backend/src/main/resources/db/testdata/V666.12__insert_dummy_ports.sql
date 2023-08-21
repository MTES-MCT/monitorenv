INSERT INTO public.ports
  (   id,           name)
VALUES
  (    1,    'Marseille'),
  (    2,   'Saint-Malo');

SELECT setval('ports_id_seq', 3, false);

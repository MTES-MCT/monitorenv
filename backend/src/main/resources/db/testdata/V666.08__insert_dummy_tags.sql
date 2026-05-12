TRUNCATE TABLE public.tags CASCADE;

INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (1, 'PN', null, '2023-01-01 00:00:00.000000', '2030-12-31 00:00:00.000000');
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (2, 'AMP', null, '2023-01-01 00:00:00.000000', '2030-12-31 00:00:00.000000');
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (3, 'SAGE', null, '2023-01-01 00:00:00.000000', '2030-12-31 00:00:00.000000');
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (4, 'Mixte', null, '2023-01-01 00:00:00.000000', '2030-12-31 00:00:00.000000');
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (5, 'Mouillage', null, '2023-01-01 00:00:00.000000', '2030-12-31 00:00:00.000000');
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (6, 'Extraction granulats', null, '2023-01-01 00:00:00.000000',
        '2030-12-31 00:00:00.000000');
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (7, 'Dragage', null, '2023-01-01 00:00:00.000000', '2030-12-31 00:00:00.000000');
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (8, 'subtagPN1', 1, '2023-01-01 00:00:00.000000', '2024-01-01 00:00:00.000000');
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (9, 'subtagPN2', 1, '2023-01-01 00:00:00.000000', null);
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (10, 'subtagMouillage1', 5, '2023-01-01 00:00:00.000000', '2030-01-01 00:00:00.000000');
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (11, 'subtagMouillage2', 5, '2023-01-01 00:00:00.000000', null);
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (12, 'out of validity', null, '2023-01-01 00:00:00.000000', now() - INTERVAL '1 day');

SELECT setval('tags_id_seq', (SELECT MAX(id) FROM tags));

INSERT INTO public.tags (name, parent_id, started_at, ended_at)
VALUES ('Dauphin', null, '2026-05-11 00:00:00.000000', null),
       ('Algue', null, '2026-05-11 00:00:00.000000', null),
       ('Coque', null, '2026-05-11 00:00:00.000000', null),
       ('Telline', null, '2026-05-11 00:00:00.000000', null),
       ('Chlordécone', null, '2026-05-11 00:00:00.000000', null),
       ('Canne à pêche', null, '2026-05-11 00:00:00.000000', null),
       ('Casier', null, '2026-05-11 00:00:00.000000', null),
       ('Tortue marine', null, '2026-05-11 00:00:00.000000', null);

TRUNCATE TABLE public.tags CASCADE;

SELECT setval('tags_id_seq',(SELECT MAX(id) FROM tags));

INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (nextval('tags_id_seq'), 'PN', null, '2023-01-01 00:00:00.000000', '2030-12-31 00:00:00.000000');
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (nextval('tags_id_seq'), 'AMP', null, '2023-01-01 00:00:00.000000', '2030-12-31 00:00:00.000000');
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (nextval('tags_id_seq'), 'SAGE', null, '2023-01-01 00:00:00.000000', '2030-12-31 00:00:00.000000');
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (nextval('tags_id_seq'), 'Mixte', null, '2023-01-01 00:00:00.000000', '2030-12-31 00:00:00.000000');
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (nextval('tags_id_seq'), 'Mouillage', null, '2023-01-01 00:00:00.000000', '2030-12-31 00:00:00.000000');
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (nextval('tags_id_seq'), 'Extraction granulats', null, '2023-01-01 00:00:00.000000',
        '2030-12-31 00:00:00.000000');
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (nextval('tags_id_seq'), 'Dragage', null, '2023-01-01 00:00:00.000000', '2030-12-31 00:00:00.000000');
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (nextval('tags_id_seq'), 'subtagPN1', 1, '2023-01-01 00:00:00.000000', '2024-01-01 00:00:00.000000');
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (nextval('tags_id_seq'), 'subtagPN2', 1, '2023-01-01 00:00:00.000000', null);
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (nextval('tags_id_seq'), 'subtagMouillage1', 5, '2023-01-01 00:00:00.000000', '2030-01-01 00:00:00.000000');
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (nextval('tags_id_seq'), 'subtagMouillage2', 5, '2023-01-01 00:00:00.000000', null);
INSERT INTO public.tags (id, name, parent_id, started_at, ended_at)
values (nextval('tags_id_seq'), 'out of validity', null, '2023-01-01 00:00:00.000000', now() - INTERVAL '1 day');

INSERT INTO
    public.tags (id, name, parent_id, started_at, ended_at)
VALUES
    (nextval('tags_id_seq'), 'Dauphin', null, '2026-05-11 00:00:00.000000', null),
    (nextval('tags_id_seq'), 'Algue', null, '2026-05-11 00:00:00.000000', null),
    (nextval('tags_id_seq'), 'Coque', null, '2026-05-11 00:00:00.000000', null),
    (nextval('tags_id_seq'), 'Telline', null, '2026-05-11 00:00:00.000000', null),
    (nextval('tags_id_seq'), 'Chlordécone', null, '2026-05-11 00:00:00.000000', null),
    (nextval('tags_id_seq'), 'Canne à pêche', null, '2026-05-11 00:00:00.000000', null),
    (nextval('tags_id_seq'), 'Casier', null, '2026-05-11 00:00:00.000000', null),
    (nextval('tags_id_seq'), 'Tortue marine', null, '2026-05-11 00:00:00.000000', null);

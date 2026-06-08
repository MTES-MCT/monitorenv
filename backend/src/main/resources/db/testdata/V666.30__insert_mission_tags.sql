INSERT INTO public.mission_tags(name, is_archived)
VALUES ('Mission tag 1', false),
       ('Mission tag 2', false),
       ('Mission tag 3', false),
       ('Mission tag 4', true),
       ('Mission tag 5', true);

INSERT INTO mission_tags_missions(mission_tags_id, missions_id)
VALUES (1, 22),
       (2, 22),
       (3, 22),
       (1, 33),
       (5, 33);
-- There are already production administrations inserted by `V0.060__create_administrations`
-- We add a few more here for testing purpose
INSERT INTO public.administrations
    (   id,                         name,   is_archived)
VALUES
    (   21,     'Administion Archivée 1',          true),
    (   22,     'Administion Archivée 2',          true);

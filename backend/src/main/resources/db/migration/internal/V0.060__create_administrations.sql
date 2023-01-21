create table administrations (
    id serial primary key,
    name varchar not null unique
);

insert into administrations(
       id,                                   name)
VALUES
    (   1,                   'Affaires Maritimes'),
    (   2,                               'Douane'),
    (   3,                     'Marine Nationale'),
    (   4,                 'Gendarmerie Maritime'),
    (   5,                             'Etranger'),
    (   6,                'Gendarmerie Nationale'),
    (   7,                     'Police Nationale'),
    (   8,                            'Armée Air'),
    (   9,                                'ONCFS'),
    (  10,                      'Parcs Nationaux'),
    (1000,                 'Inter administration'),
    (1001,                                    '-'),
    (1002,                                  'AFB'),
    (1003,            'Conservatoire du littoral'),
    (1004,                  'Réserves Naturelles'),
    (1005,                                 'DDTM'),
    (1006,                'Parcs Naturels Marins'),
    (1007,                                 'AECP'),
    (1008,                                'DREAL'),
    (1009,                            'DIRM / DM'),
    (1011,   'Office Français de la Biodiversité'),
    (1012, 'Comité Régional des Pêches Maritimes'),
    (1013,                     'Gestionnaire AMP'),
    (1014,                'Parc naturel régional'),
    (1015,                    'Police Municipale'),
    (1016,                         'DEAL Réunion'),
    (2000,                                 'DMLC'),
    (2001,                         'DREAL / DEAL'),
    (2002,                                 'DGTM');

ALTER SEQUENCE public.administrations_id_seq RESTART WITH 2003;

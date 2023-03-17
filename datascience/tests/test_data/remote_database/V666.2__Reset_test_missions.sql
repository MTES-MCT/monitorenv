
DELETE FROM env_actions;
DELETE FROM missions;

INSERT INTO public.missions (
    id, mission_types,             open_by,                                                                                                                     observations_cacem, facade,    start_datetime_utc,      end_datetime_utc,          closed_by,   mission_nature, deleted, mission_source, closed) VALUES
    (12,       '{SEA}', 'Kimberly Woodward',                 'Mother including baby same. Evidence project air practice minute their. Trouble sing suggest maintain like know too.', 'NAMO', '2022-02-24 10:56:33', '2022-05-06 19:38:29',  'Charles Kennedy',	'{ENV,OTHER}',	 false,   'MONITORENV',	  true),
    (13,      '{LAND}',   'Tyler Dickerson',                                                                'Receive hit themselves. Example community suggest seek to technology.', 'NAMO', '2022-02-07 04:16:43', '2022-07-10 19:55:50',     'Robin Keller',	 '{ENV,FISH}',	 false,   'MONITORENV',	  true),
    (19,       '{SEA}',       'Scott Lopez', 'Difficult ahead let really old around. Cover operation seven surface use show. Manage beautiful reason account prepare evening sure.', 'NAMO', '2022-06-21 13:24:04', '2022-07-18 02:49:08', 'Edward Gutierrez',      	 '{FISH}',	 false,   'MONITORENV',	  true),
    (20,      '{LAND}',     'Casey Houston',                                                              'South add memory sing population. Entire particularly deep yard avoid. ',  'MED', '2022-06-18 08:08:01', '2022-08-09 02:29:02',        'Sara Cook',	      '{ENV}',	 false,   'MONITORENV',	 false);


-- Control units keys starts at 10000
INSERT INTO missions_control_units (
    mission_id, control_unit_id) VALUES
    (       12,           10019),
    (       12,           10018),
    (       13,           10019),
    (       19,           10019),
    (       20,           10003);

INSERT INTO missions_control_resources (
    mission_id, control_resource_id) VALUES
    (       12,                  10),
    (       13,                   8);

--
-- Name: missions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.missions_id_seq', 21, true);

--
-- Add historic data imported from Poseidon with a shift of -100000 on ids
--

INSERT INTO public.missions (
         id, mission_types, open_by,        start_datetime_utc,     end_datetime_utc, closed_by, mission_nature, deleted,   mission_source, closed
) VALUES
    (-95689,        '{SEA}',  'Mike', NOW() - INTERVAL '5 days',  NOW() - INTERVAL '4 days',    'Mike',        '{ENV}',   false, 'POSEIDON_CACEM',   true),
    (-95690,       '{LAND}',  'John',  NOW() - INTERVAL '1 day', NOW() - INTERVAL '6 hours',    'John',        '{ENV}',   false, 'POSEIDON_CACEM',   true);

INSERT INTO missions_control_units (
    mission_id, control_unit_id) VALUES
    (   -95689,            1315),
    (   -95690,            1315);

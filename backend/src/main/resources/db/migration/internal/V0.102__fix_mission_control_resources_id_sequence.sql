SELECT setval('public.missions_control_resources_id_seq', (SELECT MAX(id) FROM public.missions_control_resources));

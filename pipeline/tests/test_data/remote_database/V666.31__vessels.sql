TRUNCATE public.vessels;

INSERT INTO public.vessels (ship_id, mmsi_number, status, is_banned, batch_id, row_number) VALUES (1, '545437273', 'A', false, 1, 1),
(2, '755136766', 'A', false, 1, 1), (5, '851385830', 'A', false, 1, 1), (6, '598693403', 'A', false, 1, 1);

REFRESH MATERIALIZED VIEW public.latest_vessels;
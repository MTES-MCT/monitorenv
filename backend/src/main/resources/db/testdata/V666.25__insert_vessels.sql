INSERT INTO public.vessels
VALUES (nextval('vessels_id_seq'), '11', 'A', 'PRO', false, 'IMO1111', '123456789',
        'IMMAT111111', 'SHIPNAME 1', 'DZA', 'ALGER', null, 'Porte-conteneur', 'COMMERCIAL NAME', 12.12, null, 'DURAND',
        'MICHEL',
        '1998-07-12', '82 STADE DE FRANCE', '0102030405', 'email@gmail.com', 'COMPANY NAME 1', 'FRANCE', '45.40Z',
        '3120', '2000-01-01', 1, 1);
INSERT INTO public.vessels (id, ship_id, status, category, is_banned, imo_number, mmsi_number, immatriculation,
                            ship_name, flag, batch_id, row_number)
VALUES (nextval('vessels_id_seq'), '22', 'A', 'PLA', false, 'IMO2222', 'MMSI22222',
        'IMMAT222222', 'SHIPNAME 2', 'FRA', 1, 1);
INSERT INTO public.vessels (id, ship_id, status, category, is_banned, imo_number, mmsi_number, immatriculation,
                            ship_name, flag, batch_id, row_number)
VALUES (nextval('vessels_id_seq'), '33', 'A', 'PRO', false, 'IMO2223', 'MMSI22223',
        'IMMAT222223', 'SHIPNAME 3', 'GLP', 1, 1);
INSERT INTO public.vessels (id, ship_id, status, category, is_banned, imo_number, mmsi_number, immatriculation,
                            ship_name, flag, batch_id, row_number)
VALUES (nextval('vessels_id_seq'), '44', 'A', 'PLA', true, 'IMO2224', 'MMSI22224',
        'IMMAT222224', 'BANNED SHIP', 'REU', 1, 1);
INSERT INTO public.vessels (id, ship_id, status, category, is_banned, imo_number, mmsi_number, immatriculation,
                            ship_name, flag, batch_id, row_number)
VALUES (nextval('vessels_id_seq'), '55', 'D', 'PLA', false, 'IMO2225', 'MMSI22225',
        'IMMAT222225', 'DESTROYED SHIP', 'FRA', 1, 1);
INSERT INTO public.vessels (id, ship_id, status, category, is_banned, imo_number, mmsi_number, immatriculation,
                            ship_name, batch_id, row_number)
VALUES (nextval('vessels_id_seq'), '66', 'A', 'PRO', false, null, null,
        null, 'UNKNOWN SHIP', 1, 1);

REFRESH MATERIALIZED VIEW public.latest_vessels;
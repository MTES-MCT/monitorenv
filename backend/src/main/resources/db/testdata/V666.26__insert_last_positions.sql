INSERT INTO public.last_positions(id, mmsi, vessel_id, coord, status, course, heading, speed, ts, destination, shipname)
VALUES (nextval('last_positions_id_seq'), '123456789', '11', 'POINT (-003.2196 47.6400)', 'STATUS_1',
        3020, 0,
        2010, now(), 'BRE', 'SHIPNAME 1');
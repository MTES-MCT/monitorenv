TRUNCATE public.ais_positions;

INSERT INTO public.ais_positions (id, mmsi, coord, status, course, heading, speed, ts) VALUES (1, 545437273, 'POINT (-29.01623785635482 -47.158559321739695)', 'STATUT_1', 6666, 8632, 9542, NOW() - INTERVAL '10 minutes');
INSERT INTO public.ais_positions (id, mmsi, coord, status, course, heading, speed, ts) VALUES (2, 755136766, 'POINT (-129.56689057250617 53.65961394926839)', 'STATUT_2', 5595, 4258, 533, NOW() - INTERVAL '10 minutes');
INSERT INTO public.ais_positions (id, mmsi, coord, status, course, heading, speed, ts) VALUES (3, 92030123, 'POINT (11.05964276248551 2.8143566255156713)', 'STATUT_3', 5225, 1476, 3750, NOW() - INTERVAL '30 minutes');
INSERT INTO public.ais_positions (id, mmsi, coord, status, course, heading, speed, ts) VALUES (4, 883168729, 'POINT (-104.19945639555388 -36.31227256604617)', 'STATUT_4', 6547, 4734, 1045, NOW() - INTERVAL '30 minutes');
INSERT INTO public.ais_positions (id, mmsi, coord, status, course, heading, speed, ts) VALUES (5, 851385830, 'POINT (168.45242103624486 -44.45202385317484)', 'STATUT_5', 8090, 9890, 6750, NOW() - INTERVAL '1 day');
INSERT INTO public.ais_positions (id, mmsi, coord, status, course, heading, speed, ts) VALUES (6, 598693403, 'POINT (78.18423409817728 40.52294043382852)', 'STATUT_6', 5954, 5087, 9486, '2020-12-01 00:00:00 +00:00');


--
-- Data for Name: env_actions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.env_actions (
                                         id, mission_id,    action_type,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  value, action_start_datetime_utc,   action_end_datetime_utc,                                                                                                   geom) VALUES
    ('dfb9710a-2217-4f98-94dc-283d3b7bbaae',         12, 'SURVEILLANCE',                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         '{}', '2022-11-20 20:31:41.719', '2022-11-20 23:31:41.719', ST_GeomFromText('MULTIPOLYGON(((-1.22 46.27,-1.22 46.27,-1.20 46.26,-1.19 46.26,-1.22 46.27)))', 4326)),
    ('d8e580fe-8e71-4303-a0c3-a76e1d4e4fc2',         12,      'CONTROL',                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            '{"infractions": [], "vehicleType": "VESSEL", "actionTargetType": "VEHICLE", "protectedSpecies": [], "actionNumberOfControls": 0, "actionStartDateTimeUtc": null}', '2022-11-24 20:31:41.719',                      NULL,                                   ST_GeomFromText('MULTIPOINT(-2.9822 48.1236,-3.0564 48.1177)', 4326)),
    ('88713755-3966-4ca4-ae18-10cab6249485',         19, 'SURVEILLANCE',                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              '{"observations": "Surveillance ok", "coverMissionZone": true, "protectedSpecies": []}', '2022-11-28 13:59:20.176',  '2022-12-5 19:59:20.176',                                                                                                   NULL),
    ('b05d96b8-387f-4599-bff0-cd7dab71dfb8',         20,      'CONTROL', '{"infractions": [{"id": "c52c6f20-e495-4b29-b3df-d7edfb67fdd7", "natinf": ["10038", "10054"], "toProcess": false, "vesselSize": "FROM_24_TO_46m", "vesselType": "COMMERCIAL", "companyName": null, "formalNotice": "PENDING", "observations": "Pas d''observations", "relevantCourt": "LOCAL_COURT", "infractionType": "WITH_REPORT", "registrationNumber": "BALTIK", "controlledPersonIdentity": "John Doe"}], "vehicleType": "VESSEL", "actionTargetType": "VEHICLE", "protectedSpecies": [], "actionNumberOfControls": 1, "actionStartDateTimeUtc": null}', '2022-11-17 13:59:51.108',                      NULL,                                                       ST_GeomFromText('MULTIPOINT(-2.52 47.16)', 4326)),
    ('dedbd2c2-10f5-4d75-8fe9-c50db2ae5d0b',         20,      'CONTROL',                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            '{"infractions": [], "vehicleType": "VESSEL", "actionTargetType": "VEHICLE", "protectedSpecies": [], "actionNumberOfControls": 0, "actionStartDateTimeUtc": null}', '2022-11-24 20:31:41.719',                      NULL,                                                                                                   NULL);

INSERT INTO env_actions_control_plan_themes (
    env_action_id, theme_id) VALUES 
    ('dfb9710a-2217-4f98-94dc-283d3b7bbaae', 2),
    ('88713755-3966-4ca4-ae18-10cab6249485', 107),
    ('b05d96b8-387f-4599-bff0-cd7dab71dfb8', 2);

INSERT INTO env_actions_control_plan_sub_themes (
    env_action_id, subtheme_id) VALUES 
    ('88713755-3966-4ca4-ae18-10cab6249485', 143),
    ('b05d96b8-387f-4599-bff0-cd7dab71dfb8', 34);
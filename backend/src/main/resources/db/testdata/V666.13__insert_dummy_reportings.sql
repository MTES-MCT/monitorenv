DELETE
FROM reportings;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO public.reportings
VALUES (1, 2300001, 'VEHICLE', NULL, '[
  {
    "mmsi": "",
    "vesselName": ""
  }
]',
        '0104000020E610000001000000010100000045035E406AC113C00CF3FE4C1D354840', 'NAMO', 'Description 1',
        'INFRACTION_SUSPICION', 'Rejets illicites', '{"Jet de déchet","Carénage sauvage"}', 'ACTION TAKEN', true, true,
        now() - INTERVAL '3 days', 24, false, false, NULL, NULL, NULL, NULL, NULL, 105, false,
        now() - INTERVAL '3 days');
INSERT INTO public.reportings
VALUES (2, 2300002, 'VEHICLE', 'VESSEL', '[
  {
    "mmsi": "",
    "vesselName": ""
  }
]',
        '0104000020E610000001000000010100000062C9C715311E13C050CB31D53D4F4840', 'NAMO', 'Description 2',
        'INFRACTION_SUSPICION', 'Police des mouillages', '{ZMEL}', 'ACTION TAKEN', true, true,
        now() - INTERVAL '2 days', 2, false, false, 'RST', NULL, NULL, NULL, NULL, 113, false,
        now() - INTERVAL '2 days');
INSERT INTO public.reportings
VALUES (3, 2300003, 'VEHICLE', 'VESSEL', '[
  {
    "mmsi": "012314231",
    "vesselName": "Vessel 3"
  }
]',
        '0106000020E610000001000000010300000001000000040000006E15B8857C090CC02C07754424784840552A202082FC09C0C0FD120D667A484025BF296025E00BC0805DC2889C7F48406E15B8857C090CC02C07754424784840',
        'NAMO', 'Description 3', 'INFRACTION_SUSPICION', 'Police des mouillages', '{ZMEL}', 'ACTION TAKEN', true, true,
        now() - INTERVAL '1 hour', 1, false, false, 'DEF', NULL, NULL, NULL, NULL, 109, false,
        now() - INTERVAL '1 hour');
INSERT INTO public.reportings
VALUES (4, 2300004, 'INDIVIDUAL', NULL, '[
  {
    "operatorName": "Mr le dirigeant"
  }
]',
        '0106000020E6100000010000000103000000010000000500000012F330DDB98206C0CD5EF048C0BF4840FE7303CB321005C092CE3C90A7CC4840820740BBC76A06C07E8D665D8AD94840310109D4AC5507C002C775BEE5C2484012F330DDB98206C0CD5EF048C0BF4840',
        'MED',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ultrices risus ac arcu pellentesque, et tempor justo tempor. Pellentesque sem nisl, tempor id augue non, interdum sollicitudin felis.',
        'OBSERVATION', 'Pêche à pied', '{Braconnage}', NULL, true, true, now() - INTERVAL '3 hour', 4, false, false,
        'ABC', NULL, NULL, NULL, NULL, 110, false, now() - INTERVAL '3 hour');
INSERT INTO public.reportings
VALUES (5, 2300005, 'VEHICLE', 'VESSEL', '[
  {
    "mmsi": "987654321",
    "vesselName": ""
  }
]',
        '0104000020E6100000010000000101000000417927B8BBBBD73F06D9D38A46E24840', 'Guadeloupe',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'INFRACTION_SUSPICION', 'Pêche à pied',
        '{Braconnage}', NULL,
        true, true,
        now() - INTERVAL '1 hour', 6, false, false, 'CDA', NULL, NULL, NULL, NULL, 108, false,
        now() - INTERVAL '1 hour');
INSERT INTO public.reportings
VALUES (6, 2300006, 'COMPANY', NULL, '[
  {
    "vesselName": "Héron",
    "operatorName": "La société"
  }
]',
        '0104000020E6100000010000000101000000A22CD736208DF9BF242A543717D44540', 'Guadeloupe',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'INFRACTION_SUSPICION', 'Police des mouillages',
        '{ZMEL}', NULL, true, true, now() - INTERVAL '75 minutes', 6, false, false, 'ABC', 34,
        now() - INTERVAL '15 minutes', NULL, 'b8007c8a-5135-4bc3-816f-c69c7b75d807', 100, false,
        now() - INTERVAL '60 minutes');
INSERT INTO public.reportings
VALUES (7, 2300007, 'COMPANY', NULL, '[
  {
    "vesselName": "",
    "operatorName": "Good Company"
  }
]',
        '0104000020E6100000010000000101000000BDAE0F9A19C010C068D780A5708E4740', 'NAMO',
        'Lorem LoremLorem ipsum dolor sit amet, consectetur adipiscing elit.', 'OBSERVATION', NULL, NULL, NULL, true,
        true, now() - INTERVAL '90 minutes', 6, false, false, 'DEF', 34, now() - INTERVAL '25 minutes', NULL, NULL,
        111, false, now() - INTERVAL '60 minutes');
INSERT INTO public.reportings
VALUES (8, 2300008, 'COMPANY', NULL, '[
  {
    "vesselName": "Mr le gérant",
    "operatorName": ""
  }
]',
        '0104000020E61000000100000001010000005BE1449141C0F5BF89869C29BA034740', 'NAMO',
        'Lorem LoremLorem ipsum dolor sit amet, consectetur adipiscing elit.', 'INFRACTION_SUSPICION', NULL, NULL, NULL,
        true, true, now() - INTERVAL '90 minutes', 6, false, false, 'GHI', 38, now() - INTERVAL '25 minutes', NULL,
        NULL, 20, false, now() - INTERVAL '60 minutes');

/* reporting linked to a surveillance */


INSERT INTO reportings (id, reporting_id, target_type, vehicle_type, target_details, geom, sea_front, description,
                        report_type, control_plan_theme_id, action_taken, is_control_required, has_no_unit_available,
                        created_at, validity_time, is_deleted, mission_id, attached_to_mission_at_utc,
                        detached_from_mission_at_utc, attached_env_action_id, open_by, updated_at_utc)
VALUES (9, 2300009, 'COMPANY', NULL, '[
  {
    "operatorName": "Good Company",
    "vesselName": "Mr le gérant"
  }
]', ST_GeomFromText('MULTIPOINT((-4.40757547 48.65546589))', 4326), 'NAMO',
        'Lorem LoremLorem ipsum dolor sit amet, consectetur adipiscing elit.', 'OBSERVATION', 106, NULL, true,
        true, now() - INTERVAL '90 minutes', 6, false, 53, now() - INTERVAL '25 minutes', NULL,
        '9969413b-b394-4db4-985f-b00743ffb833', 'GHI', now() - INTERVAL '60 minutes'),
    /* reporting linked to a control */
       (10, 2300010, 'INDIVIDUAL', NULL, '[
         {
           "operatorName": ""
         }
       ]', ST_GeomFromText('MULTIPOINT((-3.91241571 48.67428686))', 4326), 'NAMO',
        'Lorem LoremLorem ipsum dolor sit amet, consectetur adipiscing elit.', 'INFRACTION_SUSPICION', 104, NULL,
        true, true, now() - INTERVAL '90 minutes', 6, false, 53, now() - INTERVAL '25 minutes', NULL,
        '3480657f-7845-4eb4-aa06-07b174b1da45', 'GHI', now() - INTERVAL '60 minutes'),
/* reporting linked to a surveillance */
       (11, 2300011, 'OTHER', NULL, '[
         {
           "operatorName": ""
         }
       ]', ST_GeomFromText('MULTIPOINT((-4.76689484 48.52102012))', 4326), 'NAMO', 'La description du signalement',
        'OBSERVATION', 102, NULL, true, true, now() - INTERVAL '90 minutes', 6, false, 53,
        now() - INTERVAL '25 minutes', NULL, '9969413b-b394-4db4-985f-b00743ffb833', 'GHI',
        now() - INTERVAL '60 minutes')
;
INSERT INTO reportings_source (id, reportings_id, source_type, semaphore_id, control_unit_id, source_name)
VALUES (uuid_generate_v4(), 1, 'SEMAPHORE', 21, NULL, NULL);
INSERT INTO reportings_source (id, reportings_id, source_type, semaphore_id, control_unit_id, source_name)
VALUES (uuid_generate_v4(), 2, 'SEMAPHORE', 23, NULL, NULL);
INSERT INTO reportings_source (id, reportings_id, source_type, semaphore_id, control_unit_id, source_name)
VALUES (uuid_generate_v4(), 3, 'CONTROL_UNIT', NULL, 10000, NULL);
INSERT INTO reportings_source (id, reportings_id, source_type, semaphore_id, control_unit_id, source_name)
VALUES (uuid_generate_v4(), 4, 'OTHER', NULL, NULL, 'MA SUPER SOCIETE');
INSERT INTO reportings_source (id, reportings_id, source_type, semaphore_id, control_unit_id, source_name)
VALUES (uuid_generate_v4(), 5, 'SEMAPHORE', 36, NULL, NULL);
INSERT INTO reportings_source (id, reportings_id, source_type, semaphore_id, control_unit_id, source_name)
VALUES (uuid_generate_v4(), 6, 'SEMAPHORE', 36, NULL, NULL);
INSERT INTO reportings_source (id, reportings_id, source_type, semaphore_id, control_unit_id, source_name)
VALUES (uuid_generate_v4(), 7, 'CONTROL_UNIT', NULL, 10001, NULL);
INSERT INTO reportings_source (id, reportings_id, source_type, semaphore_id, control_unit_id, source_name)
VALUES (uuid_generate_v4(), 8, 'CONTROL_UNIT', NULL, 10001, NULL);
INSERT INTO reportings_source (id, reportings_id, source_type, semaphore_id, control_unit_id, source_name)
VALUES (uuid_generate_v4(), 9, 'CONTROL_UNIT', null, 10001, NULL);
INSERT INTO reportings_source (id, reportings_id, source_type, semaphore_id, control_unit_id, source_name)
VALUES (uuid_generate_v4(), 10, 'OTHER', null, null, 'Vigipol');
INSERT INTO reportings_source (id, reportings_id, source_type, semaphore_id, control_unit_id, source_name)
VALUES (uuid_generate_v4(), 11, 'SEMAPHORE', 36, NULL, NULL);

SELECT setval('reportings_id_seq', (SELECT max(id) FROM reportings), true);
CREATE SEQUENCE IF NOT EXISTS reportings_2023_seq;
SELECT setval('reportings_2023_seq', (SELECT max(id) FROM reportings), true);

INSERT INTO public.reportings_control_plan_sub_themes
VALUES (1, 207);
INSERT INTO public.reportings_control_plan_sub_themes
VALUES (1, 208);
INSERT INTO public.reportings_control_plan_sub_themes
VALUES (2, 235);
INSERT INTO public.reportings_control_plan_sub_themes
VALUES (3, 220);
INSERT INTO public.reportings_control_plan_sub_themes
VALUES (4, 222);
INSERT INTO public.reportings_control_plan_sub_themes
VALUES (5, 218);
INSERT INTO public.reportings_control_plan_sub_themes
VALUES (6, 180);
INSERT INTO public.reportings_control_plan_sub_themes
VALUES (6, 179);
INSERT INTO public.reportings_control_plan_sub_themes
VALUES (7, 229);
INSERT INTO public.reportings_control_plan_sub_themes
VALUES (8, 245);
INSERT INTO public.reportings_control_plan_sub_themes
VALUES (9, 212);
INSERT INTO public.reportings_control_plan_sub_themes
VALUES (10, 202);
INSERT INTO public.reportings_control_plan_sub_themes
VALUES (11, 192);
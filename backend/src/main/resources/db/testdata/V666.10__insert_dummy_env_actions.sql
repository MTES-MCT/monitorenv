--
-- Data for Name: env_actions; Type: TABLE DATA; Schema: public; Owner: postgres
--
DELETE FROM public.env_actions;

INSERT INTO public.env_actions (id, mission_id, action_type, value, action_start_datetime_utc, geom, facade, department, action_end_datetime_utc, is_administrative_control, is_compliance_with_water_regulations_control, is_safety_equipment_and_standards_compliance_control, is_seafarers_control) VALUES
('e2257638-ddef-4611-960c-7675a3254c38', 38, 'SURVEILLANCE', '{"themes": [{"theme": "Police des activités de cultures marines", "subThemes": ["Contrôle du schéma des structures"], "protectedSpecies": []}], "observations": "", "coverMissionZone": true}', '2022-07-30 08:53:31.588693', NULL, NULL, '56', '2022-07-30 10:53:31.588693', NULL, NULL, NULL,NULL),
('f3e90d3a-6ba4-4bb3-805e-d391508aa46d', 38, 'CONTROL'     , '{"themes": [{"theme": "Police des épaves", "subThemes": ["Épave/navire abandonné", "Contrôle administratif"], "protectedSpecies": []}], "infractions": [{"id": "6670e718-3ecd-46c1-8149-8b963c6f72dd", "natinf": ["10041"], "toProcess": false, "vesselSize": null, "vesselType": null, "companyName": "MASOCIETE", "formalNotice": "YES", "observations": "RAS", "relevantCourt": "LOCAL_COURT", "infractionType": "WITH_REPORT", "registrationNumber": null, "controlledPersonIdentity": null}], "vehicleType": null, "observations": null, "actionTargetType": "COMPANY", "actionNumberOfControls": 1}', '2022-07-29 11:53:31.588693', '0104000020E6100000010000000101000000399291D4BE1805C09E1A585CD6154840', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('475d2887-5344-46cd-903b-8cb5e42f9a9c', 49, 'SURVEILLANCE', '{"themes": [{"theme": "Police du conservatoire du littoral", "subThemes": ["Réglementation du conservatoire du littoral"], "protectedSpecies": []}], "duration": 0.0, "observations": "RAS", "coverMissionZone": false, "protectedSpecies": []}', NULL, '0106000020E61000000100000001030000000100000005000000D56979C3E95203C0BC117648B972474084387273B24D02C00C726AA38C6E4740BFFBD6B9762002C0349A2D10497347407A8D399212A102C0546E1659817A4740D56979C3E95203C0BC117648B9724740', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('16eeb9e8-f30c-430e-b36b-32b4673f81ce', 49, 'NOTE'        , '{"observations": "Note libre"}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('6d4b7d0a-79ce-47cf-ac26-2024d2b27f28', 49, 'CONTROL'     , '{"themes": [{"theme": "AMP sans réglementation particulière", "subThemes": ["Contrôle dans une AMP sans réglementation particulière"], "protectedSpecies": []}], "infractions": [{"id": "e56648c1-6ca3-4d5e-a5d2-114aa7c17126", "natinf": ["10231", "10228"], "toProcess": true, "vesselSize": null, "vesselType": null, "companyName": null, "formalNotice": "PENDING", "observations": "RAS", "relevantCourt": "PRE", "infractionType": "WAITING", "registrationNumber": null, "controlledPersonIdentity": "M DURAND"}], "vehicleType": null, "actionTargetType": "INDIVIDUAL", "actionNumberOfControls": 1}', NULL, '0104000020E61000000100000001010000003B0DADC6D4BB01C0A8387A2964714740', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('c52c6f20-e495-4b29-b3df-d7edfb67fdd7', 34, 'SURVEILLANCE', '{"themes": [{"theme": "Police des espèces protégées et de leurs habitats (faune et flore)", "subThemes": ["Destruction, capture, arrachage", "Atteinte aux habitats d''espèces protégées"], "protectedSpecies": ["FLORA", "BIRDS"]}, {"theme": "Police des mouillages", "subThemes": ["Mouillage individuel", "ZMEL"], "protectedSpecies": []}], "duration": 0.0, "observations": "RAS", "coverMissionZone": true, "protectedSpecies": []}', '2022-07-16 10:03:12.588693', NULL, NULL, NULL,  '2022-07-16 12:03:12.588693', NULL, NULL, NULL, NULL),
('b8007c8a-5135-4bc3-816f-c69c7b75d807', 34, 'CONTROL'     , '{"themes": [{"theme": "Police des mouillages", "subThemes": ["Mouillage individuel", "ZMEL"], "protectedSpecies": []}], "observations": "RAS", "infractions": [{"id": "5d5b7829-68cd-4436-8c0b-1cc8db7788a0", "natinf": ["10038","10231"], "toProcess": false, "vesselSize": "FROM_24_TO_46m", "vesselType": "COMMERCIAL", "companyName": null, "formalNotice": "PENDING", "observations": "Pas d''observations", "relevantCourt": "LOCAL_COURT", "infractionType": "WITH_REPORT", "registrationNumber": "BALTIK", "controlledPersonIdentity": "John Doe"}], "vehicleType": "VESSEL", "actionTargetType": "VEHICLE", "actionNumberOfControls": 1}', '2022-07-16 09:03:12.588693', '0104000020E610000001000000010100000047A07E6651E3DEBF044620AB65C54840', NULL, NULL,  '2022-07-16 12:03:12.588693', NULL, NULL, NULL, NULL),
('4d9a3139-6c60-49a5-b443-0e6238a6a120', 41, 'CONTROL'     , '{"themes": [{"theme": "Police des mouillages", "subThemes": ["Contrôle administratif"], "protectedSpecies": []}], "infractions": [], "vehicleType": null, "observations": "", "actionTargetType": null, "actionNumberOfControls": null}','2022-07-01 02:44:16.588693', NULL, NULL, NULL, NULL, TRUE, TRUE, TRUE, TRUE)
;


INSERT INTO public.env_actions VALUES 
('2cdcd429-19ab-45ed-a892-7c695bd256e2', 53, 'SURVEILLANCE', '{"themes": [{"theme": "Pêche de loisir", "subThemes": ["Pêche embarquée"], "protectedSpecies": []}], "duration": 0.0, "observations": "RAS", "coverMissionZone": true, "protectedSpecies": []}', '2022-11-21 14:29:55.588693', NULL, NULL, NULL,  '2022-11-22 12:14:48.588693'),
('3480657f-7845-4eb4-aa06-07b174b1da45', 53, 'CONTROL', '{"themes": [{"theme": "Police des mouillages", "subThemes": ["Mouillage individuel", "ZMEL"], "protectedSpecies": []}], "observations": "RAS", "infractions": [], "vehicleType": "VESSEL", "actionTargetType": "VEHICLE", "actionNumberOfControls": 0}', '2022-11-22 10:14:48.588693', '0104000020E610000001000000010100000047A07E6651E3DEBF044620AB65C54840', NULL, NULL,  NULL),
('9969413b-b394-4db4-985f-b00743ffb833', 53, 'SURVEILLANCE', '{"themes": [{"theme": "Police des espèces protégées et de leurs habitats (faune et flore)", "subThemes": ["Destruction, capture, arrachage", "Atteinte aux habitats d''espèces protégées"], "protectedSpecies": ["FLORA", "BIRDS"]}, {"theme": "Police des mouillages", "subThemes": ["Mouillage individuel", "ZMEL"], "protectedSpecies": []}], "duration": 0.0, "observations": "RAS", "coverMissionZone": true, "protectedSpecies": []}', '2022-11-21 15:29:55.588693', NULL, NULL, NULL, '2022-11-22 13:14:48.588693')
;

UPDATE public.env_actions SET
  action_start_datetime_utc = action_start_datetime_utc + (now() - '2022-06-01 23:00:00'),
  action_end_datetime_utc = action_end_datetime_utc + (now() - '2022-06-01 23:00:00')
  WHERE mission_id > 20;
  ;

INSERT INTO public.env_actions_control_plan_themes (env_action_id, theme_id) VALUES
('b8007c8a-5135-4bc3-816f-c69c7b75d807', 12),
('475d2887-5344-46cd-903b-8cb5e42f9a9c', 16),
('c52c6f20-e495-4b29-b3df-d7edfb67fdd7', 12),
('f3e90d3a-6ba4-4bb3-805e-d391508aa46d', 15),
('e2257638-ddef-4611-960c-7675a3254c38', 9),
('4d9a3139-6c60-49a5-b443-0e6238a6a120', 12),
('6d4b7d0a-79ce-47cf-ac26-2024d2b27f28', 1)
;

INSERT INTO public.env_actions_control_plan_sub_themes(env_action_id, subtheme_id) VALUES
('e2257638-ddef-4611-960c-7675a3254c38', 51),
('f3e90d3a-6ba4-4bb3-805e-d391508aa46d', 83),
('f3e90d3a-6ba4-4bb3-805e-d391508aa46d', 43),
('475d2887-5344-46cd-903b-8cb5e42f9a9c', 79),
('6d4b7d0a-79ce-47cf-ac26-2024d2b27f28', 48),
('c52c6f20-e495-4b29-b3df-d7edfb67fdd7', 64),
('c52c6f20-e495-4b29-b3df-d7edfb67fdd7', 82),
('b8007c8a-5135-4bc3-816f-c69c7b75d807', 64),
('b8007c8a-5135-4bc3-816f-c69c7b75d807', 82),
('4d9a3139-6c60-49a5-b443-0e6238a6a120', 42)
;

INSERT INTO public.env_actions_control_plan_tags(env_action_id, tag_id) VALUES
('c52c6f20-e495-4b29-b3df-d7edfb67fdd7', 1),
('c52c6f20-e495-4b29-b3df-d7edfb67fdd7', 2);

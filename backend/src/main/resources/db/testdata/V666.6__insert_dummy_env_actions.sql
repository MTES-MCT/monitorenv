--
-- Data for Name: env_actions; Type: TABLE DATA; Schema: public; Owner: postgres
--
TRUNCATE public.env_actions;
INSERT INTO public.env_actions VALUES ('f3e90d3a-6ba4-4bb3-805e-d391508aa46d', 38, 'CONTROL', '{"themes": [{"theme": "Police des espèces protégées et de leurs habitats (faune et flore)", "subThemes": ["Dérogations concernant les espèces protégées"], "protectedSpecies": ["MARINE_MAMMALS"]}], "infractions": [{"id": "6670e718-3ecd-46c1-8149-8b963c6f72dd", "natinf": ["10041"], "toProcess": false, "vesselSize": null, "vesselType": null, "companyName": "MASOCIETE", "formalNotice": "YES", "observations": "RAS", "relevantCourt": "LOCAL_COURT", "infractionType": "WITH_REPORT", "registrationNumber": null, "controlledPersonIdentity": null}], "vehicleType": null, "actionTargetType": "COMPANY", "actionNumberOfControls": 1}', NULL, '0104000020E61000000100000001010000005021F1D4BE1805C074D5525CD6154840');
INSERT INTO public.env_actions VALUES ('475d2887-5344-46cd-903b-8cb5e42f9a9c', 49, 'SURVEILLANCE', '{"themes": [{"theme": "Police du conservatoire du littoral", "subThemes": ["Réglementation du conservatoire du littoral"], "protectedSpecies": []}], "duration": 0.0, "observations": "RAS", "coverMissionZone": false, "protectedSpecies": []}', NULL, '0106000020E61000000100000001030000000100000005000000D56979C3E95203C0BC117648B972474084387273B24D02C00C726AA38C6E4740BFFBD6B9762002C0349A2D10497347407A8D399212A102C0546E1659817A4740D56979C3E95203C0BC117648B9724740');
INSERT INTO public.env_actions VALUES ('16eeb9e8-f30c-430e-b36b-32b4673f81ce', 49, 'NOTE', '{"observations": "Note libre"}', NULL, NULL);
INSERT INTO public.env_actions VALUES ('6d4b7d0a-79ce-47cf-ac26-2024d2b27f28', 49, 'CONTROL', '{"themes": [{"theme": "AMP sans réglementation particulière", "subThemes": ["Contrôle dans une AMP sans réglementation particulière"], "protectedSpecies": []}], "infractions": [{"id": "e56648c1-6ca3-4d5e-a5d2-114aa7c17126", "natinf": ["10231", "10228"], "toProcess": true, "vesselSize": null, "vesselType": null, "companyName": null, "formalNotice": "PENDING", "observations": "RAS", "relevantCourt": "PRE", "infractionType": "WAITING", "registrationNumber": null, "controlledPersonIdentity": "M DURAND"}], "vehicleType": null, "actionTargetType": "INDIVIDUAL", "actionNumberOfControls": 1}', NULL, '0104000020E61000000100000001010000003B0DADC6D4BB01C0A8387A2964714740');

INSERT INTO public.env_actions VALUES ('b8007c8a-5135-4bc3-816f-c69c7b75d807', 34, 'SURVEILLANCE', '{"themes": [{"theme": "Police des espèces protégées et de leurs habitats (faune et flore)", "subThemes": ["Destruction, capture, arrachage", "Atteinte aux habitats d''espèces protégées"], "protectedSpecies": ["FLORA", "BIRDS"]}, {"theme": "Police des mouillages", "subThemes": ["Mouillage individuel", "ZMEL"], "protectedSpecies": []}], "duration": 0.0, "observations": "RAS", "coverMissionZone": true, "protectedSpecies": []}', '2024-04-07T09:27:36.124675Z', NULL);
INSERT INTO public.env_actions VALUES ('c52c6f20-e495-4b29-b3df-d7edfb67fdd7', 34, 'CONTROL', '{"themes": [{"theme": "Police des mouillages", "subThemes": ["Mouillage individuel", "ZMEL"], "protectedSpecies": []}], "observations": "RAS", "infractions": [{"id": "5d5b7829-68cd-4436-8c0b-1cc8db7788a0", "natinf": ["10038","10231"], "toProcess": false, "vesselSize": "FROM_24_TO_46m", "vesselType": "COMMERCIAL", "companyName": null, "formalNotice": "PENDING", "observations": "Pas d''observations", "relevantCourt": "LOCAL_COURT", "infractionType": "WITH_REPORT", "registrationNumber": "BALTIK", "controlledPersonIdentity": "John Doe"}], "vehicleType": "VESSEL", "actionTargetType": "VEHICLE", "actionNumberOfControls": 1}', '2024-04-07T08:27:36.124675Z', '0104000020E610000001000000010100000047A07E6651E3DEBF044620AB65C54840');

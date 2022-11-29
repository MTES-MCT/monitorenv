
--
-- Data for Name: env_actions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.env_actions (id, mission_id, action_type, value, action_start_datetime_utc, geom) FROM stdin;
dfb9710a-2217-4f98-94dc-283d3b7bbaae	14	SURVEILLANCE	{"actionType": "SURVEILLANCE"}	\N	\N
d8e580fe-8e71-4303-a0c3-a76e1d4e4fc2	14	CONTROL	{"actionTheme": "", "infractions": [], "vehicleType": "VESSEL", "actionSubTheme": "", "actionTargetType": "VEHICLE", "protectedSpecies": [], "actionNumberOfControls": 0, "actionStartDateTimeUtc": null}	2022-11-24 20:31:41.719	0104000020E61000000200000001010000001953F2E2ABBA05C0E86DA621AE164840010100000088DE5EA999B305C08EE55DF500184840
88713755-3966-4ca4-ae18-10cab6249485	34	SURVEILLANCE	{"duration": 1.0, "actionTheme": "Police des activités de cultures marines", "observations": "Surveillance ok", "actionSubTheme": "Contrôle du schéma des structures", "coverMissionZone": true, "protectedSpecies": []}	2022-11-28 13:59:20.176	\N
b05d96b8-387f-4599-bff0-cd7dab71dfb8	34	CONTROL	{"actionTheme": "Activités et manifestations soumises à évaluation d’incidence Natura 2000", "infractions": [{"id": "c52c6f20-e495-4b29-b3df-d7edfb67fdd7", "natinf": ["10038", "10054"], "toProcess": false, "vesselSize": "FROM_24_TO_46m", "vesselType": "COMMERCIAL", "companyName": null, "formalNotice": "PENDING", "observations": "Pas d'observations", "relevantCourt": "LOCAL_COURT", "infractionType": "WITH_REPORT", "registrationNumber": "BALTIK", "controlledPersonIdentity": "John Doe"}], "vehicleType": "VESSEL", "actionSubTheme": "Contrôle administratif", "actionTargetType": "VEHICLE", "protectedSpecies": [], "actionNumberOfControls": 1, "actionStartDateTimeUtc": null}	2022-11-17 13:59:51.108	0104000020E6100000010000000101000000E48FE404EC2CE2BF1C3DBD1E1CBA4840
dedbd2c2-10f5-4d75-8fe9-c50db2ae5d0b	38	CONTROL	{"actionTheme": "", "infractions": [], "vehicleType": "VESSEL", "actionSubTheme": "", "actionTargetType": "VEHICLE", "protectedSpecies": [], "actionNumberOfControls": 0, "actionStartDateTimeUtc": null}	2022-11-24 20:31:41.719	0104000020E61000000200000001010000001953F2E2ABBA05C0E86DA621AE164840010100000088DE5EA999B305C08EE55DF500184840
\.



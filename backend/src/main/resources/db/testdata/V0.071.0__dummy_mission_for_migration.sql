TRUNCATE public.env_actions CASCADE;
TRUNCATE public.missions CASCADE;

COPY public.missions (id, mission_type, open_by, observations_cacem, facade, start_datetime_utc, end_datetime_utc, geom, closed_by, deleted, observations_cnsp, mission_source, closed) FROM stdin;
14	AIR	Mrs. Teresa Johnson	Laugh surface few military current fine set. Wife list culture.	SA	2022-03-12 03:48:14	2022-05-15 03:13:36	\N	Michelle Lee	f	\N	MONITORENV	t
34	SEA	Steve Snyder	Surface different shoulder interview. Job together area probably. Of alone class capital determine machine always.	MEMN	2022-07-15 21:03:12.588693	\N	0106000020E61000000100000001030000000100000009000000AD0812BCE168E4BFCCDEEA3227BD4840BE63AEABD812E4BF1C5E8873F8AC484044BD156CA117DABF84C0E2AF49AC48408E16A14DE463CCBFBC9F7168A2A5484008BF4C12D0F97B3F9494F5EA3CAB4840399BF9438A28B43FDC4BF050D9BB48404BAA02B73C2CCCBF24A79C8362CD4840BC46F7A9D24DE1BFA0238D36B2D04840AD0812BCE168E4BFCCDEEA3227BD4840	Jacob Martin	f	\N	MONITORENV	f
38	LAND	Randy Woodward	Black bit sell. House relate policy once. White member worker east even anyone detail professor.	\N	2022-07-29 10:53:31.588693	2022-07-25 14:24:31.858651	0106000020E61000000300000001030000000100000005000000E1AC900B314306C0DCABC1C17F1C484077EC6F225D5006C0E9C04905DB0A4840C4FDB241475F05C0D322916C64104840C4FDB241475F05C061C3D32BE51E4840E1AC900B314306C0DCABC1C17F1C4840010300000001000000050000001A381C6D873C05C0857E01182A1748407A5824FD283005C06AB86D846A13484012C925C8E7D104C048BD6DC7D014484056F6FAE640DF04C04921B9CACD1748401A381C6D873C05C0857E01182A17484001030000000100000005000000BA44FD4709AE06C0BD44AB4926174840374C3CB9097B06C0416F22E1981148409F7BAC6C615606C0DA75EB0C3E164840F5F0C8CCC36906C01B578E56561A4840BA44FD4709AE06C0BD44AB4926174840	Timothy Patrick	f	\N	MONITORENV	t
\.

COPY public.env_actions (id, mission_id, action_type, value, action_start_datetime_utc, geom) FROM stdin;
dfb9710a-2217-4f98-94dc-283d3b7bbaae	14	SURVEILLANCE	{"actionTheme": "Activités et manifestations soumises à évaluation d’incidence Natura 2000"}	\N	\N
d8e580fe-8e71-4303-a0c3-a76e1d4e4fc2	14	CONTROL	{"actionTheme": "", "infractions": [], "vehicleType": "VESSEL", "actionSubTheme": "", "actionTargetType": "VEHICLE", "protectedSpecies": [], "actionNumberOfControls": 0, "actionStartDateTimeUtc": null}	2022-11-24 20:31:41.719	0104000020E61000000200000001010000001953F2E2ABBA05C0E86DA621AE164840010100000088DE5EA999B305C08EE55DF500184840
88713755-3966-4ca4-ae18-10cab6249485	34	SURVEILLANCE	{"duration": 1.0, "actionTheme": "Police des activités de cultures marines", "observations": "Surveillance ok", "actionSubTheme": "Contrôle du schéma des structures", "protectedSpecies": []}	2022-11-28 13:59:20.176	\N
b05d96b8-387f-4599-bff0-cd7dab71dfb8	34	CONTROL	{"actionTheme": "Activités et manifestations soumises à évaluation d’incidence Natura 2000", "infractions": [{"id": "c52c6f20-e495-4b29-b3df-d7edfb67fdd7", "natinf": ["10038", "10054"], "vesselSize": "FROM_24_TO_46m", "vesselType": "COMMERCIAL", "companyName": null, "formalNotice": "PENDING", "observations": "Pas d'observations", "infractionType": "WITH_REPORT", "registrationNumber": "BALTIK", "controlledPersonIdentity": "John Doe"}], "vehicleType": "VESSEL", "actionSubTheme": "Contrôle administratif", "actionTargetType": "VEHICLE", "protectedSpecies": [], "actionNumberOfControls": 1, "actionStartDateTimeUtc": null}	2022-11-17 13:59:51.108	0104000020E6100000010000000101000000E48FE404EC2CE2BF1C3DBD1E1CBA4840
dedbd2c2-10f5-4d75-8fe9-c50db2ae5d0b	38	CONTROL	{"actionTheme": "", "infractions": [], "vehicleType": "VESSEL", "actionSubTheme": "", "actionTargetType": "VEHICLE", "protectedSpecies": [], "actionNumberOfControls": 0, "actionStartDateTimeUtc": null}	2022-11-24 20:31:41.719	0104000020E61000000200000001010000001953F2E2ABBA05C0E86DA621AE164840010100000088DE5EA999B305C08EE55DF500184840
\.

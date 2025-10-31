--
-- Data for Name: env_actions; Type: TABLE DATA; Schema: public; Owner: postgres
--
DELETE
FROM public.env_actions;

INSERT INTO public.env_actions (id, mission_id, action_type, value, action_start_datetime_utc, geom, facade, department,
                                action_end_datetime_utc, is_administrative_control,
                                is_compliance_with_water_regulations_control,
                                is_safety_equipment_and_standards_compliance_control, is_seafarers_control, open_by,
                                completed_by)
VALUES ('e2257638-ddef-4611-960c-7675a3254c38', 38, 'SURVEILLANCE', '{
  "observations": "",
  "awareness": {
    "isRisingAwareness": true,
    "themeId": 107,
    "nbPerson": 30
  }
}', '2022-07-30 08:53:31.588693',
        '0106000020E61000000300000001030000000100000005000000E1AC900B314306C0DCABC1C17F1C484077EC6F225D5006C0E9C04905DB0A4840C4FDB241475F05C0D322916C64104840C4FDB241475F05C061C3D32BE51E4840E1AC900B314306C0DCABC1C17F1C4840010300000001000000050000001A381C6D873C05C0857E01182A1748407A5824FD283005C06AB86D846A13484012C925C8E7D104C048BD6DC7D014484056F6FAE640DF04C04921B9CACD1748401A381C6D873C05C0857E01182A17484001030000000100000005000000BA44FD4709AE06C0BD44AB4926174840374C3CB9097B06C0416F22E1981148409F7BAC6C615606C0DA75EB0C3E164840F5F0C8CCC36906C01B578E56561A4840BA44FD4709AE06C0BD44AB4926174840',
        NULL, '56', '2022-07-30 10:53:31.588693', NULL, NULL, NULL, NULL, 'ABC', NULL),
       ('f3e90d3a-6ba4-4bb3-805e-d391508aa46d', 38, 'CONTROL', '{
         "infractions": [
           {
             "id": "6670e718-3ecd-46c1-8149-8b963c6f72dd",
             "natinf": [
               "10041"
             ],
             "vesselSize": 23,
             "vesselType": "COMMERCIAL",
             "companyName": "MASOCIETE",
             "formalNotice": "YES",
             "observations": "RAS",
             "infractionType": "WITH_REPORT",
             "administrativeResponse": "REGULARIZATION",
             "registrationNumber": null,
             "controlledPersonIdentity": null,
             "seizure": "NO"
           }
         ],
         "vehicleType": null,
         "observations": null,
         "actionTargetType": "COMPANY",
         "actionNumberOfControls": 1
       }', '2022-07-29 11:53:31.588693', '0104000020E6100000010000000101000000399291D4BE1805C09E1A585CD6154840', NULL,
        NULL, NULL, NULL, NULL, NULL, NULL, 'ABC', 'DEF'),
       ('475d2887-5344-46cd-903b-8cb5e42f9a9c', 49, 'SURVEILLANCE', '{
         "duration": 0.0,
         "observations": "RAS",
         "protectedSpecies": []
       }', NULL,
        '0106000020E61000000100000001030000000100000005000000D56979C3E95203C0BC117648B972474084387273B24D02C00C726AA38C6E4740BFFBD6B9762002C0349A2D10497347407A8D399212A102C0546E1659817A4740D56979C3E95203C0BC117648B9724740',
        NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ABC', NULL),
       ('16eeb9e8-f30c-430e-b36b-32b4673f81ce', 49, 'NOTE', '{
         "observations": "Note libre"
       }', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
       ('6d4b7d0a-79ce-47cf-ac26-2024d2b27f28', 49, 'CONTROL', '{
         "infractions": [
           {
             "id": "e56648c1-6ca3-4d5e-a5d2-114aa7c17126",
             "natinf": [
               "10231",
               "10228"
             ],
             "vesselSize": 11,
             "vesselType": null,
             "companyName": null,
             "formalNotice": "PENDING",
             "observations": "RAS",
             "infractionType": "WAITING",
             "administrativeResponse": "PENDING",
             "registrationNumber": null,
             "controlledPersonIdentity": "M DURAND",
             "seizure": "YES"
           }
         ],
         "vehicleType": null,
         "actionTargetType": "INDIVIDUAL",
         "actionNumberOfControls": 1
       }', NULL, '0104000020E61000000100000001010000003B0DADC6D4BB01C0A8387A2964714740', NULL, NULL, NULL, NULL, NULL,
        NULL, NULL, 'ABC', null),
       ('c52c6f20-e495-4b29-b3df-d7edfb67fdd7', 34, 'SURVEILLANCE', '{
         "duration": 0.0,
         "observations": "RAS",
         "protectedSpecies": [],
         "awareness" :{
           "isRisingAwareness": true,
            "themeId": 103,
            "nbPerson": 25
         }
       }', '2022-07-16 10:03:12.588693',
        '0106000020E61000000100000001030000000100000009000000AD0812BCE168E4BFCCDEEA3227BD4840BE63AEABD812E4BF1C5E8873F8AC484044BD156CA117DABF84C0E2AF49AC48408E16A14DE463CCBFBC9F7168A2A5484008BF4C12D0F97B3F9494F5EA3CAB4840399BF9438A28B43FDC4BF050D9BB48404BAA02B73C2CCCBF24A79C8362CD4840BC46F7A9D24DE1BFA0238D36B2D04840AD0812BCE168E4BFCCDEEA3227BD4840',
        'MEMN', NULL, '2022-07-16 12:03:12.588693', NULL, NULL, NULL, NULL, 'ABC', 'DEF'),
       ('b8007c8a-5135-4bc3-816f-c69c7b75d807', 34, 'CONTROL', '{
         "observations": "RAS",
         "infractions": [
           {
             "id": "5d5b7829-68cd-4436-8c0b-1cc8db7788a0",
             "mmsi": "123456789",
             "natinf": [
               "10038",
               "10231"
             ],
             "vesselSize": 45,
             "vesselType": "COMMERCIAL",
             "companyName": null,
             "formalNotice": "PENDING",
             "observations": "Pas d''observations",
             "infractionType": "WITH_REPORT",
             "administrativeResponse": "PENDING",
             "registrationNumber": "BALTIK",
             "controlledPersonIdentity": "John Doe",
             "seizure": "NO"
           }
         ],
         "vehicleType": "VESSEL",
         "actionTargetType": "VEHICLE",
         "actionNumberOfControls": 1
       }', '2022-07-16 09:01:12.588693', '0104000020E610000001000000010100000047A07E6651E3DEBF044620AB65C54840', NULL,
        NULL, '2022-07-16 12:03:12.588693', NULL, NULL, NULL, NULL, 'ABC', NULL),
       ('4d9a3139-6c60-49a5-b443-0e6238a6a120', 41, 'CONTROL', '{
         "infractions": [],
         "vehicleType": null,
         "observations": "",
         "actionTargetType": null,
         "actionNumberOfControls": null
       }', NULL, NULL, NULL, NULL, NULL, TRUE, TRUE, TRUE, TRUE, 'ABC', 'DEF'),
       ('5865b619-3280-4c67-94ca-9f15da7d5aa7', 27, 'CONTROL', '{
         "infractions": [],
         "vehicleType": "VESSEL",
         "observations": "",
         "actionTargetType": "VEHICLE",
         "actionNumberOfControls": 1
       }', '2022-07-01 02:44:16.588693', NULL, NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE, 'ABC', 'EFG')
;


INSERT INTO public.env_actions
VALUES ('2cdcd429-19ab-45ed-a892-7c695bd256e2', 53, 'SURVEILLANCE', '{
  "observations": "RAS"
}', '2022-11-21 14:29:55.588693',
        '0106000020E610000001000000010300000001000000040000003CE3086FE6CC13C01444234445F44740EFDAD0710F1D13C07CA5E067610548406DBC9AAB788B13C0781CCFCB160748403CE3086FE6CC13C01444234445F44740',
        NULL, NULL, '2022-11-22 12:14:48.588693', NULL, NULL, NULL, NULL, 'TO_COMPLETE',
        'ABC', 'DEF'),
       ('3480657f-7845-4eb4-aa06-07b174b1da45', 53, 'CONTROL', '{
         "observations": "RAS",
         "infractions": [],
         "vehicleType": "VESSEL",
         "actionTargetType": "VEHICLE",
         "actionNumberOfControls": 0
       }', '2022-11-22 10:14:48.588693', '0104000020E610000001000000010100000047A07E6651E3DEBF044620AB65C54840', NULL,
        NULL, NULL, NULL, NULL, NULL, NULL, 'TO_COMPLETE', 'ABC', 'DEF'),
       ('9969413b-b394-4db4-985f-b00743ffb833', 53, 'SURVEILLANCE', '{
         "observations": "RAS",
         "protectedSpecies": []
       }', '2022-11-21 18:29:55.588693',
        '0106000020E610000001000000010300000001000000040000003CE3086FE6CC13C01444234445F44740EFDAD0710F1D13C07CA5E067610548406DBC9AAB788B13C0781CCFCB160748403CE3086FE6CC13C01444234445F44740',
        NULL, NULL, '2022-11-22 13:14:48.588693', NULL, NULL, NULL, NULL,
        'TO_COMPLETE', 'ABC', 'DEF')
;

UPDATE public.env_actions
SET action_start_datetime_utc = action_start_datetime_utc + (now() - '2022-06-01 23:00:00'),
    action_end_datetime_utc   = action_end_datetime_utc + (now() - '2022-06-01 23:00:00')
WHERE mission_id > 20;


insert into public.themes_env_actions (themes_id, env_actions_id)
values (15, '4d9a3139-6c60-49a5-b443-0e6238a6a120'),
       (101, '6d4b7d0a-79ce-47cf-ac26-2024d2b27f28'),
       (112, 'f3e90d3a-6ba4-4bb3-805e-d391508aa46d'),
       (100, 'b8007c8a-5135-4bc3-816f-c69c7b75d807'),
       (107, '475d2887-5344-46cd-903b-8cb5e42f9a9c'),
       (103, 'c52c6f20-e495-4b29-b3df-d7edfb67fdd7'),
       (100, 'c52c6f20-e495-4b29-b3df-d7edfb67fdd7'),
       (107, 'e2257638-ddef-4611-960c-7675a3254c38'),
       (3, '5865b619-3280-4c67-94ca-9f15da7d5aa7'),
       (322, '6d4b7d0a-79ce-47cf-ac26-2024d2b27f28'),
       (327, 'c52c6f20-e495-4b29-b3df-d7edfb67fdd7'),
       (329, 'c52c6f20-e495-4b29-b3df-d7edfb67fdd7'),
       (333, 'f3e90d3a-6ba4-4bb3-805e-d391508aa46d'),
       (279, 'c52c6f20-e495-4b29-b3df-d7edfb67fdd7'),
       (327, 'b8007c8a-5135-4bc3-816f-c69c7b75d807'),
       (118, '5865b619-3280-4c67-94ca-9f15da7d5aa7'),
       (336, '475d2887-5344-46cd-903b-8cb5e42f9a9c'),
       (312, 'c52c6f20-e495-4b29-b3df-d7edfb67fdd7'),
       (157, '4d9a3139-6c60-49a5-b443-0e6238a6a120'),
       (318, 'f3e90d3a-6ba4-4bb3-805e-d391508aa46d'),
       (336, 'e2257638-ddef-4611-960c-7675a3254c38'),
       (355, 'c52c6f20-e495-4b29-b3df-d7edfb67fdd7'),
       (367, 'c52c6f20-e495-4b29-b3df-d7edfb67fdd7');
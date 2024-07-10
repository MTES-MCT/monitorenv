/* PUBLISHED VIGILANCE AREAS */
INSERT INTO public.vigilance_areas(id, comments, created_by, end_date_period, ending_condition, ending_occurrence_date, ending_occurrence_number, frequency, geom, is_draft, links, name,source,
start_date_period, themes, visibility ) 
VALUES (1, 'Commentaire sur la zone de vigilance', 'ABC', '2024-12-16 23:59:59.00000', 'NEVER', NULL, NULL, 'NONE', '0106000020E61000000100000001030000000100000021000000B7785F507915FABF5CBF7F7E61214740418F3AB4C128FABF90B809BB2A20474004908E66B530FABF784D6412E51E474030BC4D2C062DFABFC41331079D1D474038BAE144D81DFABFC4DB42355F1C474017509105C103FABF00257DD5371B474038325F1CC1DFF9BF34C24045321A4740541BD7B23AB3F9BF78E914965819474007ECD3D1E37FF9BF04AFF229B31847407F6A248CB547F9BF103B216048184740FECEA995D80CF9BFF8D0EE551C18474062A5E30590D1F8BF5819CCBD301847405A56DE162398F8BF742F6CCE8418474072BD73BBC662F8BF3874964A15194740B7645DE98733F8BFB0F559A1DC194740FDF2AE6C370CF8BF54985825D31A47401B09310B58EEF7BF6439F558EF1B474090F255A70FDBF7BF94E85D4C261D4740CEF101F51BD3F7BF48E7BA096C1E4740A2C5422FCBD6F7BFCC33430BB41F47409AC7AE16F9E5F7BFE0C69CB6F1204740BB31FF551000F8BF5CC2C3D818224740994F313F1024F8BF20E3B81D1E2347407D66B9A89650F8BF18D36A7FF7234740CA95BC89ED83F8BF6006ACA79C24474052176CCF1BBCF8BF34D38A4107254740D4B2E6C5F8F6F8BF58AA05373325474070DCAC554132F9BFD04ED3D81E254740772BB244AE6BF9BF88DCC7EECA24474060C41CA00AA1F9BFC4513CB03A2447401A1D337249D0F9BFA411C0A473234740D58EE1EE99F7F9BF18583B6E7D224740B7785F507915FABF5CBF7F7E61214740', false, '[{"linkText": "lien vers arrêté réfectoral", "linkUrl": "www.google.fr"}]', 'Zone de vigilance 1', 'Unité BSN Ste Maxime', '2024-12-10 00:00:00.00000', '{"Dragage","Extraction granulats"}', 'PUBLIC');

INSERT INTO public.vigilance_areas(id, comments, created_by, end_date_period, ending_condition, ending_occurrence_date, ending_occurrence_number, frequency, geom, is_draft, links, name,source,
start_date_period, themes, visibility )
VALUES (2, 'Des dauphins partout', 'DEF', '2024-03-01 23:59:59.00000', 'END_DATE', '2030-03-01 23:59:59.00000', NULL, 'ALL_WEEKS', '0106000020E610000001000000010300000001000000050000009E64CAC84F5DFDBF447087DF4CDA4840FAA68553DF2CFDBFE8B528CA7AD84840B2FDB77AA327FCBF30AA4C29CDD64840D9ADABB07A86FBBFE4090ED908D748409E64CAC84F5DFDBF447087DF4CDA4840', false, NULL, 'Zone de vigilance 2', 'Unité PAM Themis', '2024-02-15 00:00:00.00000', '{"AMP","Mixte"}', 'PRIVATE');

INSERT INTO public.vigilance_areas(id, comments, created_by, end_date_period, ending_condition, ending_occurrence_date, ending_occurrence_number, frequency, geom, is_draft, links, name,source,
start_date_period, themes, visibility )
VALUES (3, 'comments', 'GHI', '2024-07-14 23:59:59.00000', 'OCCURENCES_NUMBER', NULL, 12, 'ALL_YEARS', '0106000020E61000000100000001030000000100000008000000E9F870A11E280940CC0CF854053C4540FEE4ACCF8B240940140A8203AD434540857F3863C68D084094EE39718444454008B2439CBF550840586D9AA47F564540601B5E44435E084014DFDE24936245404904E072BD1B0A404C55F4973E614540BDBC30567E890A4004B0B61F623B4540E9F870A11E280940CC0CF854053C4540', false, '[{"linkText": "lien vers arrêté réfectoral", "linkUrl": "www.google.fr"}, {"linkText": "lien vers arrêté réfectoral 2", "linkUrl": "www.google.fr"}]', 'Zone de vigilance 3', 'Particulier qui était sur les lieux', '2024-07-14 00:00:00.00000', '{"PN","SAGE"}', 'PUBLIC');

INSERT INTO public.vigilance_areas(id, comments, created_by, end_date_period, ending_condition, ending_occurrence_date, ending_occurrence_number, frequency, geom, is_draft, links, name,source,
start_date_period, themes, visibility )
VALUES (4, 'comments', 'JKL', '2024-11-24 23:59:59.00000', 'END_DATE', '2025-12-31 23:59:59.00000', NULL,'ALL_MONTHS', '0106000020E6100000010000000103000000010000000B000000C1530E9390B809C09CCB8AE08ED247405138845383AE09C0D81EAD51ADD347408D43A734D2B309C0A0F87963B8D44740EF71916193BF09C0D461DE5673D547403F9EF361F0B809C0686F442B00D647408F77DBF258AB09C0B41BA857BED547403907773443A209C038D1EC9120D54740203FE7F454AB09C0E034792DECD447401AB051C7C0A009C0888761251DD347404075E4CAF1AF09C0C80268E341D24740C1530E9390B809C09CCB8AE08ED24740', false, NULL, 'Zone de vigilance 4', 'CACEM', '2024-11-20 00:00:00.00000', '{"AMP","PN"}', 'PRIVATE');


/* DRAFT VIGILANCE AREAS */
INSERT INTO public.vigilance_areas(id, comments, created_by, end_date_period, ending_condition, ending_occurrence_date, ending_occurrence_number, frequency, geom, is_draft, links, name,source,
start_date_period, themes, visibility )
VALUES (5, 'comments', 'ABC', '2024-05-26 23:59:59.00000', NULL, NULL, NULL, 'NONE', NULL, true, NULL, 'Zone de vigilance 5', NULL, '2024-05-25 00:00:00.00000', '{"AMP","PN"}', 'PRIVATE');

INSERT INTO public.vigilance_areas(id, comments, created_by, end_date_period, ending_condition, ending_occurrence_date, ending_occurrence_number, frequency, geom, is_draft, links, name,source,
start_date_period, themes, visibility )
VALUES (6, NULL, 'DEF', '2024-04-04 23:59:59.00000', 'NEVER', NULL, NULL, 'ALL_YEARS', '0106000020E61000000100000001030000000100000021000000D813E79DDB53FABF24C5A378DA31474058DBE0BC1A50FABFB8E3D82B08314740353ADF06FD44FABF5CCC00EE3D304740999ECED7EF32FABF0CDBC585832F4740B3BE98C6A41AFABF8CA28D1EE02E4740585907D20AFDF9BF3494B4015A2E4740C3D48B3145DBF9BF08A26E58F62D47403BE34624A0B6F9BFD0C1BAF8B82D47406F92692C8490F9BF88476A3FA42D4740A4418C34686AF9BFD0C1BAF8B82D47401C504727C345F9BF08A26E58F62D474086CBCB86FD23F9BF3494B4015A2E47402C663A926306F9BF8CA28D1EE02E47404786048118EEF8BF0CDBC585832F4740ABEAF3510BDCF8BF5CCC00EE3D3047408849F29BEDD0F8BFB8E3D82B083147400811ECBA2CCDF8BF24C5A378DA3147408849F29BEDD0F8BF944E1ABFAC324740ABEAF3510BDCF8BFC80CECEA763347404786048118EEF8BFEC212D38313447402C663A926306F9BF1056937FD434474086CBCB86FD23F9BF20609A7C5A3547401C504727C345F9BF5476E60ABE354740A4418C34686AF9BF94FD9358FB3547406F92692C8490F9BFFC1F900B103647403BE34624A0B6F9BF94FD9358FB354740C3D48B3145DBF9BF5476E60ABE354740585907D20AFDF9BF20609A7C5A354740B3BE98C6A41AFABF1056937FD4344740999ECED7EF32FABFEC212D3831344740353ADF06FD44FABFC80CECEA7633474058DBE0BC1A50FABF944E1ABFAC324740D813E79DDB53FABF24C5A378DA314740', true, '[{"linkText": "lien vers arrêté réfectoral", "linkUrl": "www.google.fr"}]', 'Zone de vigilance 6', 'Unité BSN Ste Maxime', '2024-03-12 00:00:00.00000', NULL, 'PUBLIC');

INSERT INTO public.vigilance_areas(id, comments, created_by, end_date_period, ending_condition, ending_occurrence_date, ending_occurrence_number, frequency, geom, is_draft, links, name,source,
start_date_period, themes, visibility )
VALUES (7, 'comments', 'GHI', '2024-03-31 23:59:59.00000', 'OCCURENCES_NUMBER', NULL, 6, 'ALL_WEEKS', '0106000020E6100000010000000103000000010000000500000057F77C6FBF2D15C038E1B84BCD2E48403A42C339BDB014C038E1B84BCD2E48403A42C339BDB014C010F24763BA37484057F77C6FBF2D15C010F24763BA37484057F77C6FBF2D15C038E1B84BCD2E4840', true, NULL, 'Zone de vigilance 7', 'Sémaphore de Fécamp', '2024-03-01 00:00:00.00000', NULL, NULL);

/* Period on two years */
INSERT INTO public.vigilance_areas(id, comments, created_by, end_date_period, ending_condition, ending_occurrence_date, ending_occurrence_number, frequency, geom, is_draft, links, name,source,
start_date_period, themes, visibility )
VALUES (8, 'comments', 'JKL', '2024-01-15 23:59:59.00000', 'END_DATE', '2099-12-31 23:59:59.00000', NULL, 'ALL_MONTHS',NULL , true, NULL, 'Zone de vigilance 8', NULL, '2023-12-15 00:00:00.00000', '{"Extraction granulats","Dragage"}', 'PRIVATE');


SELECT pg_catalog.setval('public.vigilance_areas_id_seq', 10, true);
DO
$$
    DECLARE
        three_months                                 INTERVAL;
        today                                        DATE;
        date_within_year_and_3_months                DATE;
        date_within_quarter                          DATE;
        date_within_year_not_in_quarter_nor_3_months DATE;
    BEGIN
        three_months := INTERVAL '3 months';
        -- Définir la date d'aujourd'hui
        today := date_trunc('day', CURRENT_DATE);

-- 1. Date dans l'année courante, mais pas dans le trimestre actuel ni dans les trois premiers mois de l'année
        date_within_year_not_in_quarter_nor_3_months := make_date(
                EXTRACT(year FROM CURRENT_DATE)::INTEGER,
                (EXTRACT(month FROM CURRENT_DATE) + 6 - 1)::INTEGER % 12 + 1, 1);

-- 2. Date dans le trimestre actuel de l'année courante
        date_within_quarter := date_trunc('quarter', CURRENT_DATE);

-- 3. Date dans les trois prochains mois
        date_within_year_and_3_months := date_trunc('month', CURRENT_DATE) + three_months;


        /* PUBLISHED VIGILANCE AREAS */
        -- period : at this moment
        INSERT INTO public.vigilance_areas(id, comments, created_by, geom, is_draft, links, name,
                                           themes, visibility, linked_amps, linked_regulatory_areas)

        VALUES (1, 'Commentaire sur la zone de vigilance', 'ABC',
                '0106000020E61000000100000001030000000100000021000000B7785F507915FABF5CBF7F7E61214740418F3AB4C128FABF90B809BB2A20474004908E66B530FABF784D6412E51E474030BC4D2C062DFABFC41331079D1D474038BAE144D81DFABFC4DB42355F1C474017509105C103FABF00257DD5371B474038325F1CC1DFF9BF34C24045321A4740541BD7B23AB3F9BF78E914965819474007ECD3D1E37FF9BF04AFF229B31847407F6A248CB547F9BF103B216048184740FECEA995D80CF9BFF8D0EE551C18474062A5E30590D1F8BF5819CCBD301847405A56DE162398F8BF742F6CCE8418474072BD73BBC662F8BF3874964A15194740B7645DE98733F8BFB0F559A1DC194740FDF2AE6C370CF8BF54985825D31A47401B09310B58EEF7BF6439F558EF1B474090F255A70FDBF7BF94E85D4C261D4740CEF101F51BD3F7BF48E7BA096C1E4740A2C5422FCBD6F7BFCC33430BB41F47409AC7AE16F9E5F7BFE0C69CB6F1204740BB31FF551000F8BF5CC2C3D818224740994F313F1024F8BF20E3B81D1E2347407D66B9A89650F8BF18D36A7FF7234740CA95BC89ED83F8BF6006ACA79C24474052176CCF1BBCF8BF34D38A4107254740D4B2E6C5F8F6F8BF58AA05373325474070DCAC554132F9BFD04ED3D81E254740772BB244AE6BF9BF88DCC7EECA24474060C41CA00AA1F9BFC4513CB03A2447401A1D337249D0F9BFA411C0A473234740D58EE1EE99F7F9BF18583B6E7D224740B7785F507915FABF5CBF7F7E61214740',
                false, '[
            {
              "linkText": "lien vers arrêté réfectoral",
              "linkUrl": "www.google.fr"
            }
          ]', 'Zone de vigilance 1',
                '{"Dragage","Extraction granulats"}', 'PUBLIC', '{"12", "6"}', '{}');

        INSERT INTO vigilance_areas_source(id, vigilance_areas_id, name, type, comments, is_anonymous)
        VALUES (uuid_generate_v4(), 1, 'Unité BSN Ste Maxime', 'OTHER'::vigilance_area_source_type,
                'Unité de surveillance locale', true);

        INSERT INTO vigilance_area_period(id, vigilance_areas_id, end_date_period, ending_condition,
                                          ending_occurrence_date,
                                          ending_occurrence_number, frequency, start_date_period, computed_end_date,
                                          is_critical)
        VALUES (uuid_generate_v4(), 1, today + INTERVAL '1 day', NULL, NULL, NULL, 'NONE', today - INTERVAL '1 day',
                today + INTERVAL '1 day', true);

        INSERT INTO vigilance_areas_source (id, vigilance_areas_id, control_unit_contacts_id, type, comments,
                                            is_anonymous)
            (SELECT DISTINCT uuid_generate_v4(),
                             1,
                             1,
                             'CONTROL_UNIT'::vigilance_area_source_type,
                             'On nous a appelé pour nous signaler un problème dans cette zone',
                             false);

        -- period : within 3 months
        INSERT INTO public.vigilance_areas(id, comments, created_by, geom, is_draft, links, name,
                                           themes, visibility, linked_amps, linked_regulatory_areas)


        VALUES (2, 'Des dauphins partout', 'DEF',
                '0106000020E610000001000000010300000001000000050000009E64CAC84F5DFDBF447087DF4CDA4840FAA68553DF2CFDBFE8B528CA7AD84840B2FDB77AA327FCBF30AA4C29CDD64840D9ADABB07A86FBBFE4090ED908D748409E64CAC84F5DFDBF447087DF4CDA4840',
                false, NULL, 'Zone de vigilance 2',
                '{"AMP","Mixte"}',
                'PRIVATE', '{}', '{"625", "425"}');

        INSERT INTO vigilance_area_period(id, vigilance_areas_id, end_date_period, ending_condition,
                                          ending_occurrence_date,
                                          ending_occurrence_number, frequency, start_date_period, computed_end_date)
        VALUES (uuid_generate_v4(), 2, date_within_year_and_3_months + INTERVAL '1 day',
                'END_DATE',
                date_within_year_and_3_months + INTERVAL '6 year',
                NULL,
                'ALL_WEEKS', date_within_year_and_3_months - three_months,
                date_within_year_and_3_months + INTERVAL '6 year');

        INSERT INTO vigilance_areas_source(id, vigilance_areas_id, name, type, is_anonymous)
        VALUES (uuid_generate_v4(), 2, 'Source anonyme d''une ZDV', 'OTHER'::vigilance_area_source_type, false);


        -- period : within this quarter
        INSERT INTO public.vigilance_areas(id, comments, created_by, geom, is_draft, links, name,
                                           themes, visibility, linked_amps, linked_regulatory_areas)
        VALUES (3, 'comments', 'GHI',
                '0106000020E61000000100000001030000000100000008000000E9F870A11E280940CC0CF854053C4540FEE4ACCF8B240940140A8203AD434540857F3863C68D084094EE39718444454008B2439CBF550840586D9AA47F564540601B5E44435E084014DFDE24936245404904E072BD1B0A404C55F4973E614540BDBC30567E890A4004B0B61F623B4540E9F870A11E280940CC0CF854053C4540',
                false, '[
            {
              "linkText": "lien vers arrêté réfectoral",
              "linkUrl": "www.google.fr"
            },
            {
              "linkText": "lien vers arrêté réfectoral 2",
              "linkUrl": "www.google.fr"
            }
          ]', 'Zone de vigilance 3', '{"PN","SAGE"}',
                'PUBLIC', '{}', '{}');

        INSERT INTO vigilance_area_period(id, vigilance_areas_id, end_date_period, ending_condition,
                                          ending_occurrence_date,
                                          ending_occurrence_number, frequency, start_date_period, computed_end_date)
        VALUES (uuid_generate_v4(), 3, date_within_quarter + INTERVAL '1 day',
                'OCCURENCES_NUMBER', NULL, 12, 'ALL_YEARS',
                date_within_quarter - INTERVAL '1 day', date_within_quarter + INTERVAL '11 year - 1 microsecond');

        INSERT INTO vigilance_areas_source(id, vigilance_areas_id, name, type, is_anonymous)
        VALUES (uuid_generate_v4(), 3, 'Particulier qui était sur les lieux', 'OTHER'::vigilance_area_source_type,
                true);

        -- period : within this year
        INSERT INTO public.vigilance_areas(id, comments, created_by, geom, is_draft, links, name,
                                           themes, visibility, linked_amps, linked_regulatory_areas)
        VALUES (4,
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et mattis est. Integer sed scelerisque nulla, eget placerat felis. Maecenas dui dui, bibendum volutpat nisl sit amet, porttitor suscipit tellus',
                'JKL',
                '0106000020E6100000010000000103000000010000000B000000C1530E9390B809C09CCB8AE08ED247405138845383AE09C0D81EAD51ADD347408D43A734D2B309C0A0F87963B8D44740EF71916193BF09C0D461DE5673D547403F9EF361F0B809C0686F442B00D647408F77DBF258AB09C0B41BA857BED547403907773443A209C038D1EC9120D54740203FE7F454AB09C0E034792DECD447401AB051C7C0A009C0888761251DD347404075E4CAF1AF09C0C80268E341D24740C1530E9390B809C09CCB8AE08ED24740',
                false, NULL, 'Zone de vigilance 4',
                '{"AMP","PN"}', 'PRIVATE', '{}', '{}');

        INSERT INTO vigilance_area_period(id, vigilance_areas_id, end_date_period, ending_condition,
                                          ending_occurrence_date,
                                          ending_occurrence_number, frequency, start_date_period, computed_end_date)
        VALUES (uuid_generate_v4(), 4, date_within_year_not_in_quarter_nor_3_months + INTERVAL '1 day', 'END_DATE',
                date_trunc('year', CURRENT_DATE) + INTERVAL '2 year - 1 microsecond', NULL, 'ALL_MONTHS',
                date_within_year_not_in_quarter_nor_3_months - INTERVAL '1 day',
                date_within_year_not_in_quarter_nor_3_months + INTERVAL '1 day');

        INSERT INTO vigilance_areas_source(id, vigilance_areas_id, name, type, is_anonymous)
        VALUES (uuid_generate_v4(), 4, 'CACEM', 'INTERNAL'::vigilance_area_source_type, false);

        -- period : outer from current year
        INSERT INTO public.vigilance_areas(id, comments, created_by, geom, is_draft, links, name,
                                           themes, visibility, linked_amps, linked_regulatory_areas)
        VALUES (9, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'JKL',
                '0106000020E61000000100000001030000000100000007000000C830399AA466F6BF9453A87E18EB45400D9F2DAA9D00F6BF04622FF852F5454096E4A71113B8F5BF6044913A01FD454037F7FB26B761F7BFB81A5FD2BEFD45406BB5ABD19B11F9BF48492DD6E6E54540B63B859AABB1F6BFD83F624C07E34540C830399AA466F6BF9453A87E18EB4540',
                false, NULL, 'Zone de vigilance 9',
                '{"Extraction granulats"}', 'PUBLIC',
                '{}', '{}');

        INSERT INTO vigilance_area_period(id, vigilance_areas_id, end_date_period, ending_condition,
                                          ending_occurrence_date,
                                          ending_occurrence_number, frequency, start_date_period, computed_end_date)
        VALUES (uuid_generate_v4(), 9, date_trunc('year', CURRENT_DATE) + INTERVAL '3 year',
                'OCCURENCES_NUMBER', NULL, 16, 'ALL_WEEKS',
                date_trunc('year', CURRENT_DATE) + INTERVAL '2 year',
                date_trunc('year', CURRENT_DATE) + INTERVAL '3 year');

        INSERT INTO vigilance_areas_source(id, vigilance_areas_id, name, type, is_anonymous)
        VALUES (uuid_generate_v4(), 9, 'CACEM', 'INTERNAL'::vigilance_area_source_type, true);

        /* DRAFT VIGILANCE AREAS */
        -- outdated
        INSERT INTO public.vigilance_areas(id, comments, created_by, geom, is_draft, links, name,
                                           themes, visibility, linked_amps, linked_regulatory_areas)
        VALUES (5,
                'Proin maximus luctus urna, sit amet pellentesque diam porta ac. Praesent nisi urna, volutpat vitae consectetur et, aliquet non nisi. Sed molestie metus nec bibendum dignissim. In hac habitasse platea dictumst. Donec eu egestas nulla.',
                'ABC',
                '0106000020E6100000010000000103000000010000000B000000ACA99227121E2140E08421C47D154540D3E6DE3F5031214070E2EDE388104540E761CC7E6A522140482E4E78E80C45404B4DD06A416921409CD57F36A00F454083F4C40A9B7E21402C1321F33E054540BACCC914244F21406CFF3FB5A0014540EF8500D4FD552140F43FE7898EFE4440B027A867692D214000C738CB7FFA44404AECC68D9AB32040585E4F4873ED4440DA4B567959602040588B590BDC064540ACA99227121E2140E08421C47D154540',
                true, NULL, 'Zone de vigilance 5',
                '{"AMP","PN"}', 'PRIVATE', '{}', '{}');

        INSERT INTO vigilance_area_period(id, vigilance_areas_id, end_date_period, ending_condition,
                                          ending_occurrence_date,
                                          ending_occurrence_number, frequency, start_date_period, computed_end_date)
        VALUES (uuid_generate_v4(), 5, today - INTERVAL '1 day', NULL, NULL, NULL,
                'NONE', today - INTERVAL '1 month', today - INTERVAL '1 day');

        INSERT INTO public.vigilance_areas(id, comments, created_by, geom, is_draft, links, name,
                                           themes, visibility, linked_amps, linked_regulatory_areas)
        -- period : within 3 months
        VALUES (6, NULL, 'DEF',
                '0106000020E61000000100000001030000000100000021000000D813E79DDB53FABF24C5A378DA31474058DBE0BC1A50FABFB8E3D82B08314740353ADF06FD44FABF5CCC00EE3D304740999ECED7EF32FABF0CDBC585832F4740B3BE98C6A41AFABF8CA28D1EE02E4740585907D20AFDF9BF3494B4015A2E4740C3D48B3145DBF9BF08A26E58F62D47403BE34624A0B6F9BFD0C1BAF8B82D47406F92692C8490F9BF88476A3FA42D4740A4418C34686AF9BFD0C1BAF8B82D47401C504727C345F9BF08A26E58F62D474086CBCB86FD23F9BF3494B4015A2E47402C663A926306F9BF8CA28D1EE02E47404786048118EEF8BF0CDBC585832F4740ABEAF3510BDCF8BF5CCC00EE3D3047408849F29BEDD0F8BFB8E3D82B083147400811ECBA2CCDF8BF24C5A378DA3147408849F29BEDD0F8BF944E1ABFAC324740ABEAF3510BDCF8BFC80CECEA763347404786048118EEF8BFEC212D38313447402C663A926306F9BF1056937FD434474086CBCB86FD23F9BF20609A7C5A3547401C504727C345F9BF5476E60ABE354740A4418C34686AF9BF94FD9358FB3547406F92692C8490F9BFFC1F900B103647403BE34624A0B6F9BF94FD9358FB354740C3D48B3145DBF9BF5476E60ABE354740585907D20AFDF9BF20609A7C5A354740B3BE98C6A41AFABF1056937FD4344740999ECED7EF32FABFEC212D3831344740353ADF06FD44FABFC80CECEA7633474058DBE0BC1A50FABF944E1ABFAC324740D813E79DDB53FABF24C5A378DA314740',
                true, '[
            {
              "linkText": "lien vers arrêté réfectoral",
              "linkUrl": "www.google.fr"
            }
          ]', 'Zone de vigilance 6', NULL, 'PUBLIC', '{}', '{}');

        INSERT INTO vigilance_area_period(id, vigilance_areas_id, end_date_period, ending_condition,
                                          ending_occurrence_date,
                                          ending_occurrence_number, frequency, start_date_period, computed_end_date)
        VALUES (uuid_generate_v4(), 6, date_within_year_and_3_months + INTERVAL '1 day', 'NEVER',
                NULL, NULL, 'ALL_YEARS', date_within_year_and_3_months - three_months, null);

        INSERT INTO vigilance_areas_source(id, vigilance_areas_id, name, type, is_anonymous)
        VALUES (uuid_generate_v4(), 6, 'Unité BSN Ste Maxime', 'OTHER'::vigilance_area_source_type, true);

        -- period : within this quarter
        INSERT INTO public.vigilance_areas(id, comments, created_by, geom, is_draft, links, name,
                                           themes, visibility, linked_amps, linked_regulatory_areas)
        VALUES (7,
                'Proin lobortis, sem quis malesuada mollis, dui orci condimentum nisl, vestibulum porttitor urna nisi non risus.',
                'GHI',
                '0106000020E6100000010000000103000000010000000500000057F77C6FBF2D15C038E1B84BCD2E48403A42C339BDB014C038E1B84BCD2E48403A42C339BDB014C010F24763BA37484057F77C6FBF2D15C010F24763BA37484057F77C6FBF2D15C038E1B84BCD2E4840',
                true, NULL, 'Zone de vigilance 7',
                NULL, 'PUBLIC', '{}', '{}');

        INSERT INTO vigilance_area_period(id, vigilance_areas_id, end_date_period, ending_condition,
                                          ending_occurrence_date,
                                          ending_occurrence_number, frequency, start_date_period, computed_end_date)
        VALUES (uuid_generate_v4(), 7, date_within_quarter + INTERVAL '1 day', 'OCCURENCES_NUMBER', NULL,
                6, 'ALL_WEEKS', date_within_quarter - INTERVAL '1 day', date_within_quarter + INTERVAL '4 months');

        INSERT INTO vigilance_areas_source(id, vigilance_areas_id, name, type, is_anonymous)
        VALUES (uuid_generate_v4(), 7, 'Sémaphore de Fécamp', 'OTHER'::vigilance_area_source_type, false);

        -- period : outer this year
        INSERT INTO public.vigilance_areas(id, comments, created_by, geom, is_draft, links, name,
                                           themes, visibility, linked_amps, linked_regulatory_areas)
        VALUES (8, 'Phasellus ac elit eget ex blandit varius.', 'JKL',
                '0106000020E61000000100000001030000000100000021000000E8D31F574509F4BF300B11820653464076C82E867DD3F3BFF85436DC6D5146404A78F0B2BC90F3BFBCB1EDB718504640717A2B949343F3BFE8DD6D3B144F4640E7A8D043F9EEF2BF4CA042726A4E4640C385FD122E96F2BF844D1FE9214E4640AD77B48D9B3CF2BFB8B4776C3D4E4640C4A5F6E8B2E5F1BFBC9B88ECBB4E46404FAE8125CB94F1BFF8D6F387984F46407CD65834004DF1BF002481BCCA504640302659601411F1BF044607BC465246402EA0C32955E3F0BF102C0BE2FD534640CE18C49E84C5F0BFEC3A5645DF554640A584D30FC8B8F0BFA4A0AF5FD85746400A5A1CCA9CBDF0BFB4D611C5D5594640AC72C546D3D3F0BF40312CE3C35B46408AB982FE90FAF0BF3489C3C18F5D4640FDC473CF5830F1BF74DF93BC275F46402815B2A21973F1BFD827AB2F7C604640021377C142C0F1BF8480CC0F806146408CE4D111DD14F2BF74683A6929624640AF07A542A86DF2BF987044C071624640C515EEC73AC7F2BFB851175056624640AEE7AB6C231EF3BF882F8B25D861464023DF20300B6FF3BF2C3DF914FC604640F6B64921D6B6F3BF184C768BCA5F4640436749F5C1F2F3BF8486213D4F5E464044EDDE2B8120F4BFD8217CB3985C4640A574DEB6513EF4BFE46FEEBFB75A4640CD08CF450E4BF4BFCC58AED7BE5846406833868B3946F4BFCCD8205FC1564640C61ADD0E0330F4BF3CB381EBD2544640E8D31F574509F4BF300B118206534640',
                false, NULL, 'Zone de vigilance 8',
                '{"Extraction granulats","Dragage"}',
                'PRIVATE', '{}', '{}');

        INSERT INTO vigilance_area_period(id, vigilance_areas_id, end_date_period, ending_condition,
                                          ending_occurrence_date,
                                          ending_occurrence_number, frequency, start_date_period, computed_end_date)
        VALUES (uuid_generate_v4(), 8, date_within_year_not_in_quarter_nor_3_months + INTERVAL '1 day', 'END_DATE',
                '2099-12-31 23:59:59.99999', NULL, 'ALL_MONTHS', date_within_year_not_in_quarter_nor_3_months,
                '2099-12-31 23:59:59.99999');

    END
$$;

SELECT pg_catalog.setval('public.vigilance_areas_id_seq', 10, true);

UPDATE vigilance_areas
SET validated_at = COALESCE(created_at, '2024-07-01 00:00:00')
WHERE is_draft IS FALSE;

INSERT INTO themes_vigilance_areas (vigilance_areas_id, themes_id)
VALUES (2, 108),
       (2, 341);


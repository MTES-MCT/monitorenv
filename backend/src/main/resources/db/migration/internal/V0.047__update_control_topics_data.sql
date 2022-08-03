TRUNCATE public.control_topics;
ALTER TABLE public.control_topics DROP COLUMN topic_level_3;

COPY public.control_topics (id,topic_level_1, topic_level_2) FROM stdin;
1	Police des mouillages	Mouillage individuel
2	Police des mouillages	ZMEL
3	Police des mouillages	Contrôle administratif
4	Police des mouillages	Autre
5	Rejets illicites	Jet de déchet
6	Rejets illicites	Carénage sauvage
7	Rejets illicites	Rejet d'eaux grises/eaux noires
8	Rejets illicites	Rejet d'hydrocarbure
9	Rejets illicites	Eaux de ballast
10	Rejets illicites	Pollutions dues aux explorations, exploitations, immersions, incinérations 
11	Rejets illicites	Rejets atmosphériques
12	Rejets illicites	Avitaillement / soutage
13	Rejets illicites	Contrôle administratif
14	Rejets illicites	Autre
15	Police des espèces protégées et de leurs habitats (faune et flore)	Destruction, capture, arrachage
16	Police des espèces protégées et de leurs habitats (faune et flore)	Perturbation d'animaux
17	Police des espèces protégées et de leurs habitats (faune et flore)	Atteinte aux habitats d'espèces protégées
18	Police des espèces protégées et de leurs habitats (faune et flore)	Détention d'espèces protégées
19	Police des espèces protégées et de leurs habitats (faune et flore)	Dérogations concernant les espèces protégées
20	Police des espèces protégées et de leurs habitats (faune et flore)	Transport, vente, exportation d'espèces protégées
21	Police des espèces protégées et de leurs habitats (faune et flore)	Contrôle administratif
22	Police des espèces protégées et de leurs habitats (faune et flore)	Autre
23	Introduction d'espèce dans le milieu naturel	Introduction d'espèces
24	Introduction d'espèce dans le milieu naturel	Contrôle administratif
25	Introduction d'espèce dans le milieu naturel	Autre
26	Police des parcs nationaux	Réglementation du parc national
27	Police des réserves naturelles	Réglementation de la réserve naturelle
28	Police des arrêtés de protection	Réglementation des arrêtés de protection
29	Police du conservatoire du littoral	Réglementation du conservatoire du littoral
30	AMP sans réglementation particulière	Contrôle dans une AMP sans réglementation particulière
31	Arrêté à visa environnemental	Arrêté du préfet maritime
32	Arrêté à visa environnemental	Arrêté du préfet de région
33	Arrêté à visa environnemental	Arrêté du préfet de département
34	Arrêté à visa environnemental	Arrêté municipal
35	Arrêté à visa environnemental	Contrôle administratif
36	Arrêté à visa environnemental	Autre
37	Activités et manifestations soumises à évaluation d’incidence Natura 2000	Documents d'évaluation d'incidence Natura 2000
38	Activités et manifestations soumises à évaluation d’incidence Natura 2001	Mesures et prescriptions Natura 2000
39	Activités et manifestations soumises à évaluation d’incidence Natura 2002	Contrôle administratif
40	Activités et manifestations soumises à évaluation d’incidence Natura 2000	Autre
41	Atteintes aux biens culturels maritimes	Aliénation / acquisition d'un bien culturel
42	Atteintes aux biens culturels maritimes	Prélèvement, prospection, fouille, sondage, déplacement d'un bien culturel
43	Atteintes aux biens culturels maritimes	Atteinte aux biens culturels
44	Atteintes aux biens culturels maritimes	Contrôle administratif
45	Atteintes aux biens culturels maritimes	Autre
46	Police des épaves	Découverte d'une épave maritime
47	Police des épaves	Recel ou détournement d'une épave maritime
48	Police des épaves	Épave/navire abandonné
49	Police des épaves	Contrôle administratif
50	Police des épaves	Autre
51	Domanialité publique dont circulation	Circulation/stationnement de VTM sur le DPM
52	Domanialité publique dont circulation	Contrôle des dérogations/autorisations
53	Domanialité publique dont circulation	Respect des espaces balisés
54	Domanialité publique dont circulation	Dégradation du DPM
55	Domanialité publique dont circulation	Prélèvement de sable ou autre
56	Domanialité publique dont circulation	Contrôle administratif
57	Domanialité publique dont circulation	Autre
58	Police des activités de cultures marines	Contrôle des autorisations administratives
59	Police des activités de cultures marines	Contrôle du schéma des structures
60	Police des activités de cultures marines	Controle de la remise en état après exploitation
61	Police des activités de cultures marines	Contrôle administratif
62	Police des activités de cultures marines	Autre
63	Travaux en milieu marin	Dragage
64	Travaux en milieu marin	Clapage
65	Travaux en milieu marin	Extraction de granulats marins
66	Travaux en milieu marin	Chantiers portuaires (digue, extension...)
67	Travaux en milieu marin	Chantiers marins (éolien, câbles...)
68	Travaux en milieu marin	Contrôle administratif
69	Travaux en milieu marin	Autre
70	Pêche à pied	Pêche de loisir
71	Pêche à pied	Pêche professionnelle
72	Pêche à pied	Braconnage
73	Pêche à pied	Contrôle administratif
74	Pêche à pied	Autre
75	Pêche de loisir	Pêche embarquée
76	Pêche de loisir	Chasse sous-marine
77	Pêche de loisir	Braconnage
78	Pêche de loisir	Contrôle administratif
79	Pêche de loisir	Autre
80	Campagnes scientifiques	Campagnes scientifiques
81	Campagnes scientifiques	Contrôle administratif
82	Campagnes scientifiques	Autre
83	Divers	Autres contrôles (spécifier dans les observations)
\.


--
-- Name: control_topics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.control_topics_id_seq', 83, true);

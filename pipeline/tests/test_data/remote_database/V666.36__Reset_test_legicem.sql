DELETE FROM legicem;

INSERT INTO legicem (
    extraction_datetime_utc, extraction_occurence, page_title, page_url, document_title, document_url
) VALUES
    (
        '2026-10-21 03:15:00', 'previous', 'Arrêté préfectoral mouillages',
        'https://legicem.metier.e2.rie.gouv.fr/arrete-prefectoral-mouillages-a101.html',
        'Arrêté n°2025-087 - PDF',
        'https://legicem.metier.e2.rie.gouv.fr/IMG/pdf/arrete_mouillages_2025.pdf'
    ),
    (
        '2026-10-21 03:15:00', 'previous', 'Ancien arrêté supprimé',
        'https://legicem.metier.e2.rie.gouv.fr/ancien-arrete-a050.html',
        NULL,
        NULL
    ),
    (
        '2026-10-22 03:15:00', 'latest', 'Arrêté préfectoral mouillages',
        'https://legicem.metier.e2.rie.gouv.fr/arrete-prefectoral-mouillages-a101.html',
        'Arrêté n°2026-101 - PDF',
        'https://legicem.metier.e2.rie.gouv.fr/IMG/pdf/arrete_mouillages_2026.pdf'
    ),
    (
        '2026-10-22 03:15:00', 'latest', 'Arrêté zone de baignade',
        'https://legicem.metier.e2.rie.gouv.fr/arrete-zone-de-baignade-a102.html',
        NULL,
        NULL
    );

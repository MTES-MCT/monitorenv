SELECT
  id,
  geom,
  nom AS "name"
FROM prod.loc_rnn_cerbere_banyuls
WHERE geom IS NOT NULL;
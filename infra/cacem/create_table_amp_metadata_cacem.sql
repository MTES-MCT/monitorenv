CREATE TABLE prod.amp_metadata_cacem (
  id SERIAL PRIMARY KEY,
  mpa_type_cacem text,
  url_legicem text
);

INSERT INTO prod.amp_metadata_cacem (id, mpa_type_cacem) 
  (SELECT amp.id, amp.mpa_type 
    FROM prod."Aires marines protégées" amp
    WHERE mpa_type IS NOT NULL);
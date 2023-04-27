DELETE FROM public.natinfs
WHERE NOT TRIM(BOTH ' ' FROM natinf_code) ~ '^[0-9]+$';

WITH infractions_with_row_number AS (
    SELECT
        natinf_code,
        row_number() OVER (PARTITION BY TRIM(BOTH ' ' FROM natinf_code) ORDER BY regulation) as row_num
      FROM natinfs
  ),
  infraction_natinf_codes_to_keep AS (
    SELECT natinf_code
      FROM infractions_with_row_number
      WHERE row_num = 1
  )

  DELETE FROM natinfs
    WHERE natinf_code NOT IN (SELECT natinf_code FROM infraction_natinf_codes_to_keep);

UPDATE public.natinfs
SET natinf_code = TRIM(BOTH ' ' FROM natinf_code);

ALTER TABLE natinfs
ALTER COLUMN natinf_code TYPE INTEGER
USING natinf_code::INTEGER;


ALTER TABLE public.natinfs DROP COLUMN id;
ALTER TABLE public.natinfs ADD PRIMARY KEY (natinf_code);

CREATE OR REPLACE FUNCTION reportings_yearly_sequence_value() RETURNS integer AS $$
  BEGIN
        /* we want to  create a sequence per year */
		IF NOT EXISTS (SELECT 0 FROM pg_class where relname = 'reportings_'||EXTRACT(year FROM CURRENT_TIMESTAMP)::TEXT||'_seq' )
			THEN
				EXECUTE format(
          'CREATE SEQUENCE IF NOT EXISTS %1$I START WITH 2;', 
			    (SELECT 'reportings_'||EXTRACT(year FROM CURRENT_TIMESTAMP)::TEXT||'_seq')
			   );
 			RETURN (RIGHT(EXTRACT(year FROM CURRENT_TIMESTAMP)::TEXT,2)||'00001')::integer;
		END IF; 
		
      /* if the sequence already exist we just want to format the reporting_id */
		RETURN (
      SELECT (RIGHT(EXTRACT(year FROM CURRENT_TIMESTAMP)::TEXT,2) || RIGHT('0000',greatest(5-length(id::text),0))||id::text)::integer
          FROM (
            SELECT nextval('reportings_'||EXTRACT(year FROM CURRENT_TIMESTAMP)::TEXT||'_seq' ) as id
          ) t
    );
  END;
$$ LANGUAGE plpgsql;


/* to clean the first reporting */
UPDATE public.reportings
SET reporting_id = '2300001'
WHERE id = 1;

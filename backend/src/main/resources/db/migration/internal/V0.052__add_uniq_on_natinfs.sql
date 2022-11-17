DELETE FROM public.natinfs where id in (SELECT id
	FROM (
		SELECT id, natinf_code, regulation, infraction_category, infraction, row_number() over (partition by natinf_code) as row_num
			FROM public.natinfs
			order by natinf_code, regulation
		) t
	WHERE not(row_num = 1));

ALTER TABLE public.natinfs ADD CONSTRAINT natinf_code_unique UNIQUE (natinf_code);
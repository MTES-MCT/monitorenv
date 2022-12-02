WITH natinfs AS (
     SELECT
        distinct
        inf.idc_fmc_natinf as id,
        inf.code as natinf_code,
        inf.texte_reglementaire as regulation,
        typinf.libelle as infraction_category,
        inf.libelle as infraction
    FROM FMC2.FMC_CODE_NATINF inf
    LEFT JOIN FMC2.FMC_CODE_TYPE_INFRACTION typinf
    ON inf.idc_fmc_type_infraction = typinf.idc_fmc_type_infraction
)
SELECT id, natinf_code, regulation, infraction_category, infraction
    FROM (
        SELECT id, natinf_code, regulation, infraction_category, infraction, row_number() over (partition by natinf_code) as row_num
			FROM natinfs
			order by natinf_code, regulation
		) t
	WHERE t.row_num = 1;
   
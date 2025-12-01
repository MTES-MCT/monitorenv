SELECT
    idc_fmc_moyen_controle AS id,
    -- Handle duplicated administration with ids 1010 and 7 in integration
    CASE WHEN idc_fmc_administration = 1010 THEN 7 ELSE idc_fmc_administration END AS administration_id,
    INITCAP(libelle) AS name
FROM FMC2.FMC_CODE_MOYEN_CONTROLE
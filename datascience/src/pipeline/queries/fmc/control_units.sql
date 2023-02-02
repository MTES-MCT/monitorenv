SELECT
    idc_fmc_moyen_controle AS id,
    idc_fmc_administration AS administration_id,
    INITCAP(libelle) AS name
FROM FMC2.FMC_CODE_MOYEN_CONTROLE
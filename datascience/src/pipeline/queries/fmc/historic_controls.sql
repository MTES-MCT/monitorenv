WITH T1 as(
SELECT
rc.id_fmc_bc_resultat_ctrl_env as id,
rc.ID_FMC_BC_MISSION as mission_id,
rc.NBRE_PERS_NAV_CTRLES as action_number_of_controls,

REGEXP_SUBSTR(inf.LIBELLE_AUTRE_INFRACTION,  '\d{4,5}') as lib_au_inf,
nat.CODE as code,
nat.LIBELLE as libelle_nat,
rc.DATE_DEBUT as action_start_datetime_utc,
cnc.LIBELLE as actionTheme,
cep.LIBELLE as protected_species,
'CONTROL' as action_type

FROM FMC2.FMC_BC_RESULTAT_CTRL_ENV rc

LEFT JOIN FMC2.FMC_BC_RES_CTRL_ENV_INFR inf
ON inf.ID_FMC_BC_RESULTAT_CTRL_ENV=rc.ID_FMC_BC_RESULTAT_CTRL_ENV

LEFT JOIN FMC2.FMC_CODE_NATINF nat
ON inf.IDC_FMC_NATINF=nat.IDC_FMC_NATINF

INNER JOIN FMC2.FMC_BC_RES_CTRL_ENV_NAT rcn
ON rc.ID_FMC_BC_RESULTAT_CTRL_ENV=rcn.ID_FMC_BC_RESULTAT_CTRL_ENV

INNER JOIN FMC2.FMC_CODE_NATURE_CONTROLE cnc
ON cnc.IDC_FMC_NATURE_CONTROLE=rcn.IDC_FMC_NATURE_CONTROLE

LEFT JOIN FMC2.FMC_BC_ESPECE_PROTEGEE ep
ON ep.ID_FMC_BC_PERTURBATION=rc.ID_FMC_BC_PERTURBATION

LEFT JOIN FMC2.FMC_CODE_ESPECE_PROTEGEE cep
ON ep.IDC_FMC_ESPECE_PROTEGEE=cep.IDC_FMC_ESPECE_PROTEGEE),

T2 as (
SELECT
id,
action_number_of_controls,
protected_species,
LISTAGG(lib_au_inf,',') WITHIN GROUP (ORDER BY id) as extracted_nat,
mission_id,
actionTheme,
LISTAGG(code,',') WITHIN GROUP (ORDER BY id) as natinf,
LISTAGG(libelle_nat, ',') WITHIN GROUP (ORDER BY id) as libelle_nat,
action_start_datetime_utc,
action_type

FROM T1
GROUP BY
id,
protected_species,
mission_id,
action_number_of_controls,
action_start_datetime_utc,
actionTheme,
action_type),

T3 as (
SELECT
T2.id,
CASE
    WHEN T2.extracted_nat is NULL THEN T2.NATINF
    WHEN T2.NATINF is NULL THEN T2.extracted_nat
    ELSE CONCAT(CONCAT(T2.NATINF, ','), T2.extracted_nat)
END
    as NATINF,
T2.actionTheme,
T2.action_number_of_controls,
LISTAGG(protected_species,',') WITHIN GROUP (ORDER BY actionTheme) as protected_species,
T2.mission_id,
T2.action_start_datetime_utc,
T2.action_type

FROM T2

GROUP BY 
T2.id,
T2.actionTheme,
CASE
    WHEN T2.extracted_nat is NULL THEN T2.NATINF
    WHEN T2.NATINF is NULL THEN T2.extracted_nat
    ELSE CONCAT(CONCAT(T2.NATINF, ','), T2.extracted_nat)
END,
T2.action_number_of_controls,
T2.mission_id,
T2.action_type,
T2.action_start_datetime_utc)

SELECT
T3.id,
LISTAGG(T3.actionTheme,',') WITHIN GROUP (ORDER BY actionTheme) as Themes,
T3.action_number_of_controls,
T3.natinf,
T3.protected_species,
T3.mission_id,
T3.action_start_datetime_utc,
T3.action_type

FROM T3
GROUP BY
T3.id,
T3.action_number_of_controls,
T3.natinf,
T3.protected_species,
T3.mission_id,
T3.action_start_datetime_utc,
T3.action_type

order by id


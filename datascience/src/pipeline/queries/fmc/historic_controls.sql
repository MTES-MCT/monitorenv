WITH control_actions as (
    SELECT
        rc.id_fmc_bc_resultat_ctrl_env as id,
        rc.ID_FMC_BC_MISSION as mission_id,
        COALESCE(rc.NBRE_PERS_NAV_CTRLES, 1) as action_number_of_controls,
        rc.DATE_DEBUT as action_start_datetime_utc,
        'CONTROL' as action_type
    FROM FMC2.FMC_BC_RESULTAT_CTRL_ENV rc
    WHERE rc.DATE_DEBUT < TO_DATE( '2023-01-01', 'YYYY-MM-DD')
),

actions_infractions AS (
    SELECT
        rc.id_fmc_bc_resultat_ctrl_env as id,
        LISTAGG(
            COALESCE(
                TRIM(nat.CODE),
                REGEXP_SUBSTR(inf.LIBELLE_AUTRE_INFRACTION,  '\d{4,5}')
            ),
            ','
        ) WITHIN GROUP (ORDER BY 1) as natinf
    FROM FMC2.FMC_BC_RESULTAT_CTRL_ENV rc
    JOIN FMC2.FMC_BC_RES_CTRL_ENV_INFR inf
    ON inf.ID_FMC_BC_RESULTAT_CTRL_ENV=rc.ID_FMC_BC_RESULTAT_CTRL_ENV
    LEFT JOIN FMC2.FMC_CODE_NATINF nat
    ON inf.IDC_FMC_NATINF=nat.IDC_FMC_NATINF
    WHERE nat.CODE IS NOT NULL OR REGEXP_SUBSTR(inf.LIBELLE_AUTRE_INFRACTION,  '\d{4,5}') IS NOT NULL
    GROUP BY rc.id_fmc_bc_resultat_ctrl_env
),

actions_themes AS (
    SELECT
        rc.id_fmc_bc_resultat_ctrl_env as id,
        LISTAGG(cnc.LIBELLE, '<separator>')  WITHIN GROUP (ORDER BY 1) as themes
    FROM FMC2.FMC_BC_RESULTAT_CTRL_ENV rc
    JOIN FMC2.FMC_BC_RES_CTRL_ENV_NAT rcn
    ON rc.ID_FMC_BC_RESULTAT_CTRL_ENV=rcn.ID_FMC_BC_RESULTAT_CTRL_ENV
    JOIN FMC2.FMC_CODE_NATURE_CONTROLE cnc
    ON cnc.IDC_FMC_NATURE_CONTROLE=rcn.IDC_FMC_NATURE_CONTROLE
    GROUP BY rc.id_fmc_bc_resultat_ctrl_env
),

actions_protected_species AS (
    SELECT
        rc.id_fmc_bc_resultat_ctrl_env as id,
        LISTAGG(cep.LIBELLE, ',') WITHIN GROUP (ORDER BY 1) as protected_species
    FROM FMC2.FMC_BC_RESULTAT_CTRL_ENV rc
    JOIN FMC2.FMC_BC_ESPECE_PROTEGEE ep
    ON ep.ID_FMC_BC_PERTURBATION=rc.ID_FMC_BC_PERTURBATION
    LEFT JOIN FMC2.FMC_CODE_ESPECE_PROTEGEE cep
    ON ep.IDC_FMC_ESPECE_PROTEGEE=cep.IDC_FMC_ESPECE_PROTEGEE
    GROUP BY rc.id_fmc_bc_resultat_ctrl_env
)

SELECT
    act.id,
    thm.themes,
    act.action_number_of_controls,
    inf.natinf,
    psp.protected_species,
    act.mission_id,
    act.action_start_datetime_utc,
    act.action_type
FROM control_actions act
LEFT JOIN actions_infractions inf
ON inf.id = act.id
LEFT JOIN actions_themes thm
ON thm.id = act.id
LEFT JOIN actions_protected_species psp
ON psp.id = act.id
order by id

import uuid
from pathlib import Path

import pandas as pd
import prefect
from prefect import Flow, task
from sqlalchemy import DDL

from config import POSEIDON_CACEM_MISSION_ID_TO_MONITORENV_MISSION_ID_SHIFT
from src.db_config import create_engine
from src.pipeline.generic_tasks import extract, load

# dictionnaire des correspondances pour les nouveaux Themes
dict_new_themes = {
    "Pêche à pied": "Pêche à pied",
    "Rejets illicites (carénage ou macro-déchets)": "Rejets illicites",
    "Police des mouillages": "Police des mouillages",
    "Police des espèces protégées et de leurs habitats": (
        "Police des espèces protégées et de leurs habitats (faune et flore)"
    ),
    "Activités et manifestations soumises à évaluation d'incidence Natura 2000": (
        "Activités et manifestations soumises à évaluation d'incidence Natura 2000"
    ),
    "Pêche de loisir": "Pêche de loisir",
    "Domanialité publique dont circulation": "Domanialité publique dont circulation",
    (
        "Lutte contre la pollution due aux opérations d'exploitation / "
        "exploration / immersion / incinération en mer"
    ): "Rejets illicites",
    "Lutte contre la pollution par les opérations d'immersion et d'incinération": (
        "Rejets illicites"
    ),
    "Cultures marines": "Police des activités de cultures marines",
    "Travaux en milieu marin (granulats)": "Travaux en milieu marin",
    "Travaux en milieu marin (dragage, clapage, infrastructures)": (
        "Travaux en milieu marin"
    ),
    "Arrêtés PREMAR": "Arrêté à visa environnemental",
    "Police des aires marines protégées": "Police des parcs nationaux",
    "Police de la chasse en mer": "Pêche de loisir",
}

# dictionnaire des correspondances pour les nouvelles façades
dict_new_facades = {
    "DIRM SA": "SA",
    "DM Guyane": "Guyane",
    "DM Martinique": "Martinique",
    "DM Guadeloupe": "Guadeloupe",
    "DM SOI": "Sud Océan Indien",
    "DIRM Med": "MED",
    "DIRM MEMN": "MEMN",
    "DIRM NAMO": "NAMO",
    "DTAM St Pierre et Miquelon": None,
    "SAM Nouvelle-Calédonie": None,
    "SAM Polynésie française": None,
}


def str_to_list(s: str, sep: str = ",") -> list:
    """
    Split input string at `sep` instances, return list of elements between `sep`
    instances.

    Args:
        s (str): string to separate.
        sep (str, optional): Separator. Defaults to ",".

    Returns:
        list: list of strings
    """
    return s.split(sep)


def make_infractions(natinf: list) -> list[dict]:
    """create infractions dictionary

    Args:
        natinf (list): a list of string natinfs

    Returns:
        list[dict]: return a list of infractions (infractions are dictionaries)
    """
    inf = []
    if natinf is None:
        inf = []
    else:
        for i in range(len(natinf)):
            inf.append(
                {
                    "id": (uuid.uuid4()),
                    "natinf": (natinf[i]).split(),
                    "toProcess": False,
                }
            )
    return inf


def make_themes(row: pd.Series) -> list[dict]:
    """
    Take a pandas Series with `themes` and `protected_species` entries, split
    `themes` from a string into a list of distinct string themes, then map the new
    themes names and create a dictionnary for each theme.

    Args:
        row (pd.Seris): pandas Series with `themes` and `protected_species` entries

    Returns:
        list[dict]: return a list of themes
    """

    themes = str_to_list(row.themes, sep="<separator>")
    lthemes = []
    for item in themes:
        lthemes.append(
            {
                "theme": dict_new_themes.get(item),
                "protected_species": row.protected_species,
            }
        )
    return lthemes


@task(checkpoint=False)
def extract_historic_controls() -> pd.DataFrame:
    """
    Extract hitoric control from the fmc database.

    Returns:
        pd.DataFrame: DataFrame historic control
    """

    return extract(db_name="fmc", query_filepath="fmc/historic_controls.sql")


@task(checkpoint=False)
def extract_historic_missions() -> pd.DataFrame:
    """
    Extract hitoric missions from the fmc database.
    Returns:
        pd.DataFrame: DataFrame historic missions
    """
    return extract(db_name="fmc", query_filepath="fmc/historic_missions.sql")


@task(checkpoint=False)
def extract_historic_missions_units() -> pd.DataFrame:
    """
    Extract hitoric missions from the fmc database.
    Returns:
        pd.DataFrame: DataFrame historic missions
    """
    return extract(
        db_name="fmc", query_filepath="fmc/historic_missions_units.sql"
    )


@task(checkpoint=False)
def make_env_actions(historic_controls: pd.DataFrame) -> pd.DataFrame:

    """
    Transform historic controls from Poseidon into the monitorenv env_actions schema structure

    Return a dataframe

    """
    historic_controls = historic_controls.copy(deep=True)
    historic_controls["mission_id"] = (
        historic_controls["mission_id"]
        + POSEIDON_CACEM_MISSION_ID_TO_MONITORENV_MISSION_ID_SHIFT
    )

    historic_controls["id"] = historic_controls.apply(
        lambda x: uuid.uuid4(), axis=1
    )

    # séparation des natinfs
    historic_controls["natinf"] = historic_controls["natinf"].map(
        str_to_list, na_action="ignore"
    )
    historic_controls["protected_species"] = historic_controls[
        "protected_species"
    ].map(str_to_list, na_action="ignore")

    historic_controls["protected_species"] = historic_controls[
        "protected_species"
    ].map(lambda y: y if isinstance(y, list) else [])

    historic_controls["infractions"] = historic_controls["natinf"].map(
        make_infractions
    )

    historic_controls["themes"] = historic_controls.apply(make_themes, axis=1)

    historic_controls["value"] = historic_controls.apply(
        lambda x: (
            {
                "themes": x.themes,
                "infractions": x.infractions,
                "vehicleType": None,
                "actionTargetType": None,
                "actionNumberOfControls": x.action_number_of_controls,
            }
        ),
        axis=1,
    )

    # fin du preprocessing
    historic_controls.drop(
        ["action_number_of_controls", "themes", "natinf", "infractions"],
        axis=1,
        inplace=True,
    )
    historic_controls = historic_controls.loc[
        :,
        [
            "id",
            "mission_id",
            "action_type",
            "value",
            "action_start_datetime_utc",
        ],
    ]

    return historic_controls


@task(checkpoint=False)
def make_env_missions(missions_poseidon: pd.DataFrame) -> pd.DataFrame:
    """Transform historic missions from Poseidon into the monitorenv missions schema structure

    Args:
        missions_poseidon (pd.DataFrame)

    Returns:
        pd.DataFrame
    """
    missions_poseidon = missions_poseidon.copy(deep=True)
    missions_poseidon["id"] = (
        missions_poseidon["id"]
        + POSEIDON_CACEM_MISSION_ID_TO_MONITORENV_MISSION_ID_SHIFT
    )
    missions_poseidon["mission_types"] = missions_poseidon["mission_type"].map(
        str_to_list, na_action="ignore"
    )

    missions_poseidon = missions_poseidon.drop(columns=["mission_type"])

    missions_poseidon["facade"] = missions_poseidon["facade"].map(
        dict_new_facades
    )
    missions_poseidon["closed"] = missions_poseidon.apply(
        lambda x: False if x.closed == "0" else True, axis=1
    )
    missions_poseidon["deleted"] = False

    return missions_poseidon


@task(checkpoint=False)
def make_env_mission_units(mission_units: pd.DataFrame) -> pd.DataFrame:
    """Transform historic missions units from Poseidon into the monitorenv env_actions schema structure

    Args:
        mission_units (pd.DataFrame)

    Returns:
        pd.DataFrame
    """
    mission_units = mission_units.copy(deep=True)
    mission_units["mission_id"] = (
        mission_units["mission_id"]
        + POSEIDON_CACEM_MISSION_ID_TO_MONITORENV_MISSION_ID_SHIFT
    )
    mission_units = mission_units.loc[
        :,
        ["mission_id", "control_unit_id"],
    ]

    return mission_units


@task(checkpoint=False)
def delete_missing_id(
    historic_controls: pd.DataFrame,
    historic_missions: pd.DataFrame,
    historic_missions_units: pd.DataFrame,
) -> pd.DataFrame:
    """Delete rows from historic_controls and historic_mission_units whose mission_id does not exist in historic_mission dataframe

    Args:
        df_rows_to_delete (pd.DataFrame): dataframe containing rows we may delete
        historic_missions (pd.DataFrame)

    Returns:
        pd.DataFrame: return the df_rows_to_delete without the missing mission_id
    """

    # listes containing mission_id of each dataframe
    l_cmi = list(historic_controls["mission_id"])
    l_mmi = list(historic_missions["id"])
    l_mumi = list(historic_missions_units["mission_id"])

    # creating lists that host mission_id differences for historic_controls and historic_missions_units with historic_missions
    cmi_diff = list(set(l_cmi) - set(l_mmi))
    mumi_diff = list(set(l_mumi) - set(l_mmi))

    # retrieving indexes of missing_ids
    index_to_drop_from_cmi = historic_controls[
        historic_controls["mission_id"].isin(cmi_diff)
    ].index
    index_to_drop_from_mumi = historic_missions_units[
        historic_missions_units["mission_id"].isin(mumi_diff)
    ].index

    historic_controls = historic_controls.drop(index_to_drop_from_cmi)
    historic_missions_units = historic_missions_units.drop(
        index_to_drop_from_mumi
    )

    return historic_controls, historic_missions_units


@task(checkpoint=False)
def load_missions_and_missions_control_units(
    historic_controls: pd.DataFrame,
    missions: pd.DataFrame,
    missions_control_units: pd.DataFrame,
):

    # In "upsert" loading mode, we want to replace only the missions whose `id` is
    # present in the DataFrame. So we use `id` as the identifier.

    e = create_engine("monitorenv_remote")
    with e.begin() as connection:

        load(
            missions,
            table_name="missions",
            schema="public",
            connection=connection,
            table_id_column="mission_source",
            logger=prefect.context.get("logger"),
            how="upsert",
            pg_array_columns=["mission_types"],
            df_id_column="mission_source",
            init_ddls=[
                DDL(
                    "ALTER TABLE public.env_actions "
                    "DROP CONSTRAINT env_actions_mission_id_fkey;"
                ),
                DDL(
                    "ALTER TABLE public.env_actions "
                    "ADD CONSTRAINT env_actions_mission_id_fkey "
                    "FOREIGN KEY (mission_id) "
                    "REFERENCES public.missions(id) "
                    "ON DELETE CASCADE;"
                ),
                DDL(
                    "ALTER TABLE public.missions_control_units "
                    "DROP CONSTRAINT missions_control_units_mission_id_fkey;"
                ),
                DDL(
                    "ALTER TABLE public.missions_control_units "
                    "ADD CONSTRAINT missions_control_units_mission_id_fkey "
                    "FOREIGN KEY (mission_id) "
                    "REFERENCES public.missions(id) "
                    "ON DELETE CASCADE;"
                ),
            ],
            end_ddls=[
                DDL(
                    "ALTER TABLE public.env_actions "
                    "DROP CONSTRAINT env_actions_mission_id_fkey;"
                ),
                DDL(
                    "ALTER TABLE public.env_actions "
                    "ADD CONSTRAINT env_actions_mission_id_fkey "
                    "FOREIGN KEY (mission_id) "
                    "REFERENCES public.missions (id);"
                ),
                DDL(
                    "ALTER TABLE public.missions_control_units "
                    "DROP CONSTRAINT missions_control_units_mission_id_fkey;"
                ),
                DDL(
                    "ALTER TABLE public.missions_control_units "
                    "ADD CONSTRAINT missions_control_units_mission_id_fkey "
                    "FOREIGN KEY (mission_id) "
                    "REFERENCES public.missions(id);"
                ),
            ],
        )

        load(
            historic_controls,
            table_name="env_actions",
            schema="public",
            logger=prefect.context.get("logger"),
            jsonb_columns=["value"],
            how="append",
            connection=connection,
        )

        load(
            missions_control_units,
            table_name="missions_control_units",
            schema="public",
            connection=connection,
            logger=prefect.context.get("logger"),
            how="append",
        )


with Flow("Historic control") as flow:
    controls = extract_historic_controls()
    missions = extract_historic_missions()
    missions_units = extract_historic_missions_units()

    controls = make_env_actions(controls)
    missions = make_env_missions(missions)
    missions_units = make_env_mission_units(missions_units)

    load_missions_and_missions_control_units(
        controls, missions, missions_units
    )

flow.file_name = Path(__file__).name

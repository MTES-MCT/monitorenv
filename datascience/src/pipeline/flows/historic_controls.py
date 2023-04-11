import uuid
from pathlib import Path

import pandas as pd
import prefect
from prefect import Flow, task
from sqlalchemy import DDL

from src.db_config import create_engine
from src.pipeline.generic_tasks import extract, load

POSEIDON_CACEM_MISSION_ID_TO_MONITORENV_MISSION_ID_SHIFT = -100000

# dictionnaire des correspondances pour les nouveaux Themes
dict_new_themes = {
    "Pêche à pied": "Pêche à pied",
    "Rejets illicites (carénage ou macro-déchets)": "Rejets illicites",
    "Police des mouillages": "Police des mouillages",
    "Police des espèces protégées et de leurs habitats": "Police des espèces protégées et de leurs habitats (faune et flore)",
    "Activités et manifestations soumises à évaluation d'incidence Natura 2000": "Activités et manifestations soumises à évaluation d'incidence Natura 2000",
    "Pêche de loisir": "Pêche de loisir",
    "Domanialité publique dont circulation": "Domanialité publique dont circulation",
    "Lutte contre la pollution due aux opérations d'exploitation / exploration / immersion / incinération en mer": "Rejets illicites",
    "Lutte contre la pollution par les opérations d'immersion et d'incinération": "Rejets illicites",
    "Cultures marines": "Police des activités de cultures marines",
    "Travaux en milieu marin (granulats)": "Travaux en milieu marin",
    "Travaux en milieu marin (dragage, clapage, infrastructures)": "Travaux en milieu marin",
    "Arrêtés PREMAR": "Arrêté à visa environnemental",
    "Police des aires marines protégées": "Police des parcs nationaux",
    "Police de la chasse en mer": "Pêche de loisir",
}

# dictionnaire des correspondances pour les nouvelles façades
dict_new_facades = {
    "DIRM SA": "SA",
    "DM Guyane": "Guyane",
    "DM Martinique": "Martinique",
    "DM Guadeloupe": "Guadeloupe et îles du Nord",
    "DM SOI": "Sud Océan Indien",
    "DIRM Med": "MED",
    "DIRM MEMN": "MEMN",
    "DIRM NAMO": "NAMO",
    "DTAM St Pierre et Miquelon": None,
    "SAM Nouvelle-Calédonie": None,
    "SAM Polynésie française": None,
}


def manage_protected_species(protected_species: str) -> list:
    """create a list of protected_species

    Args:
        protected_species (str): a string composed of nothing, one string, or several string separated with commas

    Returns:
        list: an empty list if there was no protected species, or a list of separated species if there was one or several protected species
    """
    if "," in protected_species:
        protected_species = protected_species.split(",")
    elif protected_species == "":
        protected_species = protected_species.split()
    else:
        protected_species = [protected_species]
    return protected_species


def manage_natinf(text_natinfs: str) -> list:
    """Separate natinfs within a long string in a list of string natinfs
    The condition is based on the "," in the string because the parameter in the split function is not the same

    Args:
        text_natinfs (str): a string composed of multiple natinfs

    Returns:
        list: containaing separated natinfs strings
    """
    if "," in text_natinfs:
        text_natinfs = text_natinfs.split(",")
    else:
        text_natinfs = text_natinfs.split()
    return text_natinfs


def manage_mission_types(text_types: str) -> list:
    if "," in text_types:
        text_types = text_types.split(",")
    else:
        text_types = text_types.split()
    return text_types


def make_infractions(natinf: list) -> list[dict]:
    """create infractions dictionary

    Args:
        natinf (list): a list of string natinfs

    Returns:
        list[dict]: return a list of infractions (infractions are dictionaries)
    """
    inf = []
    if len(natinf) == 0:
        inf.append({"id": (uuid.uuid4()), "natinf": [], "toProcess": False})
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

    historic_controls["mission_id"] = (
        historic_controls["mission_id"]
        + POSEIDON_CACEM_MISSION_ID_TO_MONITORENV_MISSION_ID_SHIFT
    )

    historic_controls["action_number_of_controls"] = historic_controls[
        "action_number_of_controls"
    ].fillna(0)
    historic_controls["Themes"] = historic_controls["Themes"].fillna("")
    historic_controls["Themes"] = historic_controls["Themes"].map(
        dict_new_themes
    )
    historic_controls["natinf"] = historic_controls["natinf"].fillna(" ")
    historic_controls["id"] = historic_controls.apply(
        lambda x: uuid.uuid4(), axis=1
    )

    historic_controls["action_number_of_controls"] = historic_controls.apply(
        lambda x: int(x.action_number_of_controls), axis=1
    )
    historic_controls["action_start_datetime_utc"] = historic_controls.apply(
        lambda x: pd.Timestamp(x.action_start_datetime_utc), axis=1
    )
    historic_controls["geom"] = None

    # creation of new json columns
    historic_controls["infractions"] = ""

    # séparation des natinfs
    historic_controls["natinf"] = historic_controls["natinf"].apply(
        manage_natinf
    )
    historic_controls["protected_species"] = historic_controls[
        "protected_species"
    ].apply(manage_protected_species)

    historic_controls["infractions"] = historic_controls["natinf"].map(
        make_infractions
    )

    historic_controls["value"] = historic_controls.apply(
        lambda x: (
            {
                "themes": [
                    {
                        "theme": x.Themes,
                        "protected_species": x.protected_species,
                    }
                ],
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
        ["action_number_of_controls", "Themes", "natinf", "infractions"],
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
            "geom",
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

    missions_poseidon["id"] = (
        missions_poseidon["id"]
        + POSEIDON_CACEM_MISSION_ID_TO_MONITORENV_MISSION_ID_SHIFT
    )
    missions_poseidon["mission_types"] = missions_poseidon[
        "mission_types"
    ].map(manage_mission_types)
    missions_poseidon["start_datetime_utc"] = missions_poseidon.apply(
        lambda x: pd.Timestamp(x.start_datetime_utc), axis=1
    )
    missions_poseidon["end_datetime_utc"] = missions_poseidon.apply(
        lambda x: pd.Timestamp(x.end_datetime_utc), axis=1
    )
    missions_poseidon["observations_cnsp"] = None
    missions_poseidon["mission_source"] = "POSEIDON_CACEM"
    missions_poseidon["deleted"] = False
    missions_poseidon["geom"] = None
    missions_poseidon["facade"] = missions_poseidon["facade"].map(
        dict_new_facades
    )
    missions_poseidon["closed"] = missions_poseidon.apply(
        lambda x: False if x.closed == "0" else True, axis=1
    )

    return missions_poseidon


@task(checkpoint=False)
def make_env_mission_units(mission_units: pd.DataFrame) -> pd.DataFrame:
    """Transform historic missions units from Poseidon into the monitorenv env_actions schema structure

    Args:
        mission_units (pd.DataFrame)

    Returns:
        pd.DataFrame
    """

    mission_units["mission_id"] = (
        mission_units["mission_id"]
        + POSEIDON_CACEM_MISSION_ID_TO_MONITORENV_MISSION_ID_SHIFT
    )
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

        breakpoint()

        load(
            missions,
            table_name="missions",
            schema="public",
            connection=connection,
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

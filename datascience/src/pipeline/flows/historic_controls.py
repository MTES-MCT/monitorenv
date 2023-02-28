import uuid
from pathlib import Path

import pandas as pd
from prefect import Flow, task

from src.pipeline.generic_tasks import extract

PATH_actions = "path_to_the_doc.csv"
PATH_miss = "path_to_the_doc.csv"


@task(checkpoint=False)
def extract_historic_controls() -> pd.DataFrame:
    """
    Extract hitoric control units from the fmc database.
    Returns:
        pd.DataFrame: DataFrame historic controls
    """
    return extract(db_name="fmc", query_filepath="fmc/control_units.sql")


'''
@task(checkpoint=False)
def extract_historic_missions() -> pd.DataFrame:
        """
    Extract hitoric missions from the fmc database.
    Returns:
        pd.DataFrame: DataFrame historic missions
    """
    return extract(db_name="fmc", query_filepath="fmc/control_units.sql")
'''


# fonction utilisable pour prétraiter les natinfs
def func(temp):
    if len(temp) <= 8:
        temp = temp.split()
    else:
        temp = temp.split(",")
    return temp


# test pour valider si les 2 dictionnaires "infractions" sont similaires
def dic_infr(df1: pd.DataFrame, df2: pd.DataFrame, id: int):
    for i in range(len(df1["value"][id]["infractions"])):
        t1 = df1["value"][id]["infractions"][i].copy()
        t2 = df2["value"][id]["infractions"][i].copy()
        del t1["id"], t2["id"]
        assert t1 == t2


# test pour valider si 2 dictionnaires "value" sont similaires
def dic_value(df1: pd.DataFrame, df2: pd.DataFrame):
    for i in range(len(df1["value"])):
        t1 = df1["value"][i].copy()
        t2 = df2["value"][i].copy()
        del t1["infractions"], t2["infractions"]
        assert t1 == t2


@task(checkpoint=False)
def prep_controls(dataframe: pd.DataFrame) -> pd.DataFrame:

    """
    Transform historic datas into the proper type
    Return a dataframe

    """
    dataframe = dataframe.drop_duplicates()
    dataframe.columns = [
        "control_id",
        "natinf",
        "actionTheme",
        "actionNumberOfControls",
        "mission_id",
        "actionStartDateTimeUtc",
        "action_type",
        "protectedSpecies",
        "subThemes",
    ]
    dataframe["actionNumberOfControls"] = dataframe[
        "actionNumberOfControls"
    ].fillna(0)
    dataframe["actionTheme"] = dataframe["actionTheme"].fillna("")
    dataframe["natinf"] = dataframe["natinf"].fillna(" ")
    dataframe["uuid"] = dataframe.apply(lambda x: uuid.uuid4(), axis=1)
    dataframe["actionNumberOfControls"] = dataframe.apply(
        lambda x: int(x.actionNumberOfControls), axis=1
    )
    dataframe["actionStartDateTimeUtc"] = dataframe.apply(
        lambda x: pd.Timestamp(x.actionStartDateTimeUtc), axis=1
    )
    dataframe["geom"] = ""

    # creation of new json columns
    dataframe["value"] = ""
    dataframe["infractions"] = ""

    # séparation des natinfs
    dataframe["natinf"] = dataframe["natinf"].apply(func)
    dataframe["subThemes"] = dataframe["subThemes"].apply(func)
    dataframe["protectedSpecies"] = dataframe["protectedSpecies"].apply(func)

    # construction des json
    for i in range(len(dataframe)):
        dataframe["infractions"][i] = []
        if len(dataframe["natinf"][i]) <= 1:
            dataframe["infractions"][i].append(
                {
                    "id": str(uuid.uuid4()),
                    "natinf": dataframe["natinf"][i],
                    "toProcess": False,
                    "companyName": "MASOCIETE",
                    "formalNotice": "YES",
                    "observations": "RAS",
                    "relevantCourt": "LOCAL_COURT",
                    "infractionType": "WITH_REPORT",
                }
            )
        else:
            for j in range(len(dataframe["natinf"][i])):
                dataframe["infractions"][i].append(
                    {
                        "id": str(uuid.uuid4()),
                        "natinf": [dataframe["natinf"][i][j]],
                        "toProcess": False,
                        "companyName": "MASOCIETE",
                        "formalNotice": "YES",
                        "observations": "RAS",
                        "relevantCourt": "LOCAL_COURT",
                        "infractionType": "WITH_REPORT",
                    }
                )

    dataframe["value"] = dataframe.apply(
        lambda x: (
            {
                "themes": [
                    {
                        "theme": x.actionTheme,
                        "subThemes": x.subThemes,
                        "protectedSpecies": x.protectedSpecies,
                    }
                ],
                "infractions": x.infractions,
                "vehicleType": "",
                "actionTargetType": "COMPANY",
                "actionNumberOfControls": x.actionNumberOfControls,
            }
        ),
        axis=1,
    )

    # fin du preprocessing
    dataframe.drop(
        [
            "actionNumberOfControls",
            "actionTheme",
            "natinf",
            "infractions",
            "control_id",
        ],
        axis=1,
        inplace=True,
    )
    dataframe.rename(columns={"uuid": "id"}, inplace=True)
    dataframe = dataframe.loc[
        :,
        [
            "id",
            "mission_id",
            "action_type",
            "value",
            "actionStartDateTimeUtc",
            "geom",
        ],
    ]

    return dataframe


@task(checkpoint=False)
def del_duplicate(df_act: pd.DataFrame, df_miss: pd.DataFrame) -> pd.DataFrame:

    # recherche des valeurs erronées
    se = df_act["mission_id"].dropna()
    l_act = list(se)
    l_miss = list(df_miss["id"].astype("int"))

    temp = {}
    for i in range(len(l_act)):
        try:
            if int(l_act[i]) not in l_miss:
                temp[i] = l_act[i]
        except ValueError:
            temp[i] = l_act[i]
            # print(l_act[i])

    # suppression des valeurs erronées
    for i in temp.values():
        df_act.drop(df_act[df_act["mission_id"] == i].index, inplace=True)

    return df_act


with Flow("Historic control") as flow:
    controls = extract_historic_controls()
    # missions = extract_historic_missions()

    controls = prep_controls(controls)

    # suppression des action_theme : on ne garde que la première occurence
    # controls=suppr_act_theme(controls)

    # recherche et suppression des mission_id absents de env_action mais présents dans missions
    # controls=del_duplicate(controls, missions)


flow.file_name = Path(__file__).name

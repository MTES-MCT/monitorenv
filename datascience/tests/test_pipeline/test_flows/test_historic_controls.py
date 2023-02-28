import uuid

import pandas as pd
import pytest


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


from src.pipeline.flows.historic_controls import prep_controls


@pytest.fixture
def historic_controls() -> pd.DataFrame:

    return pd.DataFrame(
        {
            "A": [10009, 10010, 10011, 10012, 10013, 10014],
            "Z": [" ", "10041", "10080,10010", "2785", " ", "2798,10042"],
            "B": [
                "Police des espèces protégées et de leurs habitats (faune et flore)",
                "Pêche à pied",
                "Domanialité publique dont circulation",
                "Pêche à pied",
                "Domanialité publique dont circulation",
                "Police des aires marines protégées",
            ],
            "C": [5, 1, 2, 70, 16, 42],
            "D": [10012, 10013, 10015, 10017, 10018, 10019],
            "E": [
                "12/03/2017 09:40:00",
                "14/03/2017 10:00:00",
                "23/03/2017 21:00:00",
                "28/03/2017 10:00:00",
                "29/03/2017 12:15:00",
                "29/03/2017 11:45:00",
            ],
            "F": [
                "CONTROL",
                "CONTROL",
                "CONTROL",
                "CONTROL",
                "CONTROL",
                "CONTROL",
            ],
            "Y": [
                "Mamifères marins",
                "Oiseaux,Flore",
                "",
                "Flore",
                "",
                "Oiseaux,Mammifères marins",
            ],
            "X": [
                "Dérogations concernant les espèces protégées",
                "Pêche à la canne à pêche,Pêche au filet",
                "",
                "",
                "Cirulation non autorisée",
                "Police des aires marines,Police aériennes des oiseaux",
            ],
        }
    )


@pytest.fixture
def transformed_historic_controls() -> pd.DataFrame:

    return pd.DataFrame(
        {
            "id": [
                uuid.uuid4(),
                uuid.uuid4(),
                uuid.uuid4(),
                uuid.uuid4(),
                uuid.uuid4(),
                uuid.uuid4(),
            ],
            "mission_id": [10012, 10013, 10015, 10017, 10018, 10019],
            "action_type": [
                "CONTROL",
                "CONTROL",
                "CONTROL",
                "CONTROL",
                "CONTROL",
                "CONTROL",
            ],
            "value": [
                {
                    "themes": [
                        {
                            "theme": "Police des espèces protégées et de leurs habitats (faune et flore)",
                            "subThemes": [
                                "Dérogations concernant les espèces protégées"
                            ],
                            "protectedSpecies": ["Mamifères marins"],
                        }
                    ],
                    "infractions": [
                        {
                            "id": uuid.uuid4(),
                            "natinf": [],
                            "toProcess": False,
                            "companyName": "MASOCIETE",
                            "formalNotice": "YES",
                            "observations": "RAS",
                            "relevantCourt": "LOCAL_COURT",
                            "infractionType": "WITH_REPORT",
                        }
                    ],
                    "vehicleType": "",
                    "actionTargetType": "COMPANY",
                    "actionNumberOfControls": int(5),
                },
                {
                    "themes": [
                        {
                            "theme": "Pêche à pied",
                            "subThemes": [
                                "Pêche à la canne à pêche",
                                "Pêche au filet",
                            ],
                            "protectedSpecies": ["Oiseaux", "Flore"],
                        }
                    ],
                    "infractions": [
                        {
                            "id": uuid.uuid4(),
                            "natinf": ["10041"],
                            "toProcess": False,
                            "companyName": "MASOCIETE",
                            "formalNotice": "YES",
                            "observations": "RAS",
                            "relevantCourt": "LOCAL_COURT",
                            "infractionType": "WITH_REPORT",
                        }
                    ],
                    "vehicleType": "",
                    "actionTargetType": "COMPANY",
                    "actionNumberOfControls": int(1),
                },
                {
                    "themes": [
                        {
                            "theme": "Domanialité publique dont circulation",
                            "subThemes": [],
                            "protectedSpecies": [],
                        }
                    ],
                    "infractions": [
                        {
                            "id": uuid.uuid4(),
                            "natinf": ["10080"],
                            "toProcess": False,
                            "companyName": "MASOCIETE",
                            "formalNotice": "YES",
                            "observations": "RAS",
                            "relevantCourt": "LOCAL_COURT",
                            "infractionType": "WITH_REPORT",
                        },
                        {
                            "id": uuid.uuid4(),
                            "natinf": ["10010"],
                            "toProcess": False,
                            "companyName": "MASOCIETE",
                            "formalNotice": "YES",
                            "observations": "RAS",
                            "relevantCourt": "LOCAL_COURT",
                            "infractionType": "WITH_REPORT",
                        },
                    ],
                    "vehicleType": "",
                    "actionTargetType": "COMPANY",
                    "actionNumberOfControls": int(2),
                },
                {
                    "themes": [
                        {
                            "theme": "Pêche à pied",
                            "subThemes": [],
                            "protectedSpecies": ["Flore"],
                        }
                    ],
                    "infractions": [
                        {
                            "id": uuid.uuid4(),
                            "natinf": ["2785"],
                            "toProcess": False,
                            "companyName": "MASOCIETE",
                            "formalNotice": "YES",
                            "observations": "RAS",
                            "relevantCourt": "LOCAL_COURT",
                            "infractionType": "WITH_REPORT",
                        }
                    ],
                    "vehicleType": "",
                    "actionTargetType": "COMPANY",
                    "actionNumberOfControls": int(70),
                },
                {
                    "themes": [
                        {
                            "theme": "Domanialité publique dont circulation",
                            "subThemes": ["Cirulation non autorisée"],
                            "protectedSpecies": [],
                        }
                    ],
                    "infractions": [
                        {
                            "id": uuid.uuid4(),
                            "natinf": [],
                            "toProcess": False,
                            "companyName": "MASOCIETE",
                            "formalNotice": "YES",
                            "observations": "RAS",
                            "relevantCourt": "LOCAL_COURT",
                            "infractionType": "WITH_REPORT",
                        }
                    ],
                    "vehicleType": "",
                    "actionTargetType": "COMPANY",
                    "actionNumberOfControls": int(16),
                },
                {
                    "themes": [
                        {
                            "theme": "Police des aires marines protégées",
                            "subThemes": [
                                "Police des aires marines",
                                "Police aériennes des oiseaux",
                            ],
                            "protectedSpecies": [
                                "Oiseaux",
                                "Mammifères marins",
                            ],
                        },
                    ],
                    "infractions": [
                        {
                            "id": uuid.uuid4(),
                            "natinf": ["2798"],
                            "toProcess": False,
                            "companyName": "MASOCIETE",
                            "formalNotice": "YES",
                            "observations": "RAS",
                            "relevantCourt": "LOCAL_COURT",
                            "infractionType": "WITH_REPORT",
                        },
                        {
                            "id": uuid.uuid4(),
                            "natinf": ["10042"],
                            "toProcess": False,
                            "companyName": "MASOCIETE",
                            "formalNotice": "YES",
                            "observations": "RAS",
                            "relevantCourt": "LOCAL_COURT",
                            "infractionType": "WITH_REPORT",
                        },
                    ],
                    "vehicleType": "",
                    "actionTargetType": "COMPANY",
                    "actionNumberOfControls": int(42),
                },
            ],
            "actionStartDateTimeUtc": [
                pd.Timestamp("2017-12-03 09:40:00"),
                pd.Timestamp("2017-03-14 10:00:00"),
                pd.Timestamp("2017-03-23 21:00:00"),
                pd.Timestamp("2017-03-28 10:00:00"),
                pd.Timestamp("2017-03-29 12:15:00"),
                pd.Timestamp("2017-03-29 11:45:00"),
            ],
            "geom": ["", "", "", "", "", ""],
        }
    )


def is_valid_uuid(uuid_to_test, version=4):
    assert type(uuid_to_test) == uuid.UUID


def test_prep_controls(historic_controls, transformed_historic_controls):

    historic_controls = prep_controls.run(historic_controls)
    pd.testing.assert_series_equal(
        historic_controls["actionStartDateTimeUtc"],
        transformed_historic_controls["actionStartDateTimeUtc"],
    )
    pd.testing.assert_series_equal(
        historic_controls["mission_id"],
        transformed_historic_controls["mission_id"],
    )
    pd.testing.assert_series_equal(
        historic_controls["action_type"],
        transformed_historic_controls["action_type"],
    )
    historic_controls["id"].apply(is_valid_uuid)

    # test sur la validité des dictionnaires "infractions" - on en test que 3
    dic_infr(historic_controls, transformed_historic_controls, 0)
    dic_infr(historic_controls, transformed_historic_controls, 1)
    dic_infr(historic_controls, transformed_historic_controls, 2)
    dic_infr(historic_controls, transformed_historic_controls, 3)
    dic_infr(historic_controls, transformed_historic_controls, 4)
    dic_infr(historic_controls, transformed_historic_controls, 5)

    # test sur la validité des dictionnaires "value"
    dic_value(historic_controls, transformed_historic_controls)

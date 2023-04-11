import uuid
from unittest.mock import MagicMock, patch

import pandas as pd
import pytest
from prefect import task

from src.pipeline.flows.historic_controls import (
    flow,
    load_missions_and_missions_control_units,
    make_env_actions,
    make_env_mission_units,
    make_env_missions,
)
from src.read_query import read_query


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


historic_controls_df = pd.DataFrame(
    {
        "id": [10009, 10010, 10011, 10012, 10013, 10014],
        "Themes": [
            "Police des espèces protégées et de leurs habitats",
            "Pêche à pied",
            "Domanialité publique dont circulation",
            "Pêche à pied",
            "Domanialité publique dont circulation",
            "Police des aires marines protégées",
        ],
        "action_number_of_controls": [5, 1, 2, 70, 16, 42],
        "natinf": [" ", "10041", "10080,10010", "2785", " ", "2798,10042"],
        "protected_species": [
            "Mamifères marins",
            "Oiseaux,Flore",
            "",
            "Flore",
            "",
            "Oiseaux,Mammifères marins",
        ],
        "mission_id": [10012, 10013, 10015, 10017, 10018, 10019],
        "action_start_datetime_utc": [
            "12/03/2017 09:40:00",
            "14/03/2017 10:00:00",
            "23/03/2017 21:00:00",
            "28/03/2017 10:00:00",
            "29/03/2017 12:15:00",
            "29/03/2017 11:45:00",
        ],
        "action_type": [
            "CONTROL",
            "CONTROL",
            "CONTROL",
            "CONTROL",
            "CONTROL",
            "CONTROL",
        ],
    }
)
historic_missions_df = pd.DataFrame(
    {
        "id": [10023, 10037, 10038, 10043, 10045, 10047, 10050],
        "mission_types": ["SEA", "SEA", "LAND", "SEA", "LAND", "AIR", "LAND"],
        "open_by": ["JBL", "GYT", "RIO", "CBG", "LEG", "RIO", "CRO"],
        "observations_cacem": [
            "91 pàp pro contrôlés/ 4 pàp pro en infraction surquotas",
            "Surveillance: protection des aires marines / protection des espèces sensibles dont perturbation intentionnelle des espèces protégées  RAS",
            None,
            "contrôle de 3 pêcheurs plaisanciers : RAS",
            None,
            "pas pris la commune lors de la déclaration",
            None,
        ],
        "facade": [
            "DIRM NAMO",
            "DIRM Med",
            "DIRM NAMO",
            "DIRM NAMO",
            "DIRM NAMO",
            "DIRM NAMO",
            "DIRM Med",
        ],
        "start_datetime_utc": [
            "29/03/2017 11:45:00",
            "30/03/2017 07:00:00",
            "06/04/2017 09:00:00",
            "09/04/2017 10:45:00",
            "15/04/2017 10:00:00",
            "17/04/2017 08:00:00",
            "22/04/2017 07:30:00",
        ],
        "end_datetime_utc": [
            "29/03/2017 16:00:00",
            "30/03/2017 10:30:00",
            "06/04/2017 13:15:00",
            "09/04/2017 11:10:00",
            "15/04/2017 18:00:00",
            "17/04/2017 13:30:00",
            "22/04/2017 10:30:00",
        ],
        "closed_by": ["VSQ", "VSQ", "GYT", "RIO", "CBG", "VSQ", "VSQ"],
        "mission_nature": [
            "{ENV}",
            "{ENV}",
            "{ENV}",
            "{ENV}",
            "{ENV}",
            "{ENV}",
            "{ENV}",
        ],
        "mission_source": [
            "POSEIDON_CACEM",
            "POSEIDON_CACEM",
            "POSEIDON_CACEM",
            "POSEIDON_CACEM",
            "POSEIDON_CACEM",
            "POSEIDON_CACEM",
            "POSEIDON_CACEM",
        ],
        "closed": ["1", "1", "1", "1", "0", "1", "1"],
    }
)
historic_missions_units_df = pd.DataFrame(
    {
        "mission_id": [11488, 11489, 11490, 11492, 11495, 11496, 11501],
        "control_unit_id": [102, 102, 102, 12, 116, 20, 1037],
    }
)


@pytest.fixture
def historic_controls() -> pd.DataFrame:
    return historic_controls_df


@pytest.fixture
def transformed_historic_controls() -> pd.DataFrame:

    return pd.DataFrame(
        {
            "id": [
                uuid.UUID("27c395ff-9357-438c-b62b-08861780c33a"),
                uuid.UUID("27c395ff-9357-438c-b62b-08861780c33a"),
                uuid.UUID("27c395ff-9357-438c-b62b-08861780c33a"),
                uuid.UUID("27c395ff-9357-438c-b62b-08861780c33a"),
                uuid.UUID("27c395ff-9357-438c-b62b-08861780c33a"),
                uuid.UUID("27c395ff-9357-438c-b62b-08861780c33a"),
            ],
            "mission_id": [
                10012 - 100000,
                10013 - 100000,
                10015 - 100000,
                10017 - 100000,
                10018 - 100000,
                10019 - 100000,
            ],
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
                            "protected_species": ["Mamifères marins"],
                        }
                    ],
                    "infractions": [
                        {
                            "id": uuid.UUID(
                                "27c395ff-9357-438c-b62b-08861780c33a"
                            ),
                            "natinf": [],
                            "toProcess": False,
                        }
                    ],
                    "vehicleType": None,
                    "actionTargetType": None,
                    "actionNumberOfControls": int(5),
                },
                {
                    "themes": [
                        {
                            "theme": "Pêche à pied",
                            "protected_species": ["Oiseaux", "Flore"],
                        }
                    ],
                    "infractions": [
                        {
                            "id": uuid.UUID(
                                "27c395ff-9357-438c-b62b-08861780c33a"
                            ),
                            "natinf": ["10041"],
                            "toProcess": False,
                        }
                    ],
                    "vehicleType": None,
                    "actionTargetType": None,
                    "actionNumberOfControls": int(1),
                },
                {
                    "themes": [
                        {
                            "theme": "Domanialité publique dont circulation",
                            "protected_species": [],
                        }
                    ],
                    "infractions": [
                        {
                            "id": uuid.UUID(
                                "27c395ff-9357-438c-b62b-08861780c33a"
                            ),
                            "natinf": ["10080"],
                            "toProcess": False,
                        },
                        {
                            "id": uuid.UUID(
                                "27c395ff-9357-438c-b62b-08861780c33a"
                            ),
                            "natinf": ["10010"],
                            "toProcess": False,
                        },
                    ],
                    "vehicleType": None,
                    "actionTargetType": None,
                    "actionNumberOfControls": int(2),
                },
                {
                    "themes": [
                        {
                            "theme": "Pêche à pied",
                            "protected_species": ["Flore"],
                        }
                    ],
                    "infractions": [
                        {
                            "id": uuid.UUID(
                                "27c395ff-9357-438c-b62b-08861780c33a"
                            ),
                            "natinf": ["2785"],
                            "toProcess": False,
                        }
                    ],
                    "vehicleType": None,
                    "actionTargetType": None,
                    "actionNumberOfControls": int(70),
                },
                {
                    "themes": [
                        {
                            "theme": "Domanialité publique dont circulation",
                            "protected_species": [],
                        }
                    ],
                    "infractions": [
                        {
                            "id": uuid.UUID(
                                "27c395ff-9357-438c-b62b-08861780c33a"
                            ),
                            "natinf": [],
                            "toProcess": False,
                        }
                    ],
                    "vehicleType": None,
                    "actionTargetType": None,
                    "actionNumberOfControls": int(16),
                },
                {
                    "themes": [
                        {
                            "theme": "Police des parcs nationaux",
                            "protected_species": [
                                "Oiseaux",
                                "Mammifères marins",
                            ],
                        },
                    ],
                    "infractions": [
                        {
                            "id": uuid.UUID(
                                "27c395ff-9357-438c-b62b-08861780c33a"
                            ),
                            "natinf": ["2798"],
                            "toProcess": False,
                        },
                        {
                            "id": uuid.UUID(
                                "27c395ff-9357-438c-b62b-08861780c33a"
                            ),
                            "natinf": ["10042"],
                            "toProcess": False,
                        },
                    ],
                    "vehicleType": None,
                    "actionTargetType": None,
                    "actionNumberOfControls": int(42),
                },
            ],
            "action_start_datetime_utc": [
                pd.Timestamp("2017-12-03 09:40:00"),
                pd.Timestamp("2017-03-14 10:00:00"),
                pd.Timestamp("2017-03-23 21:00:00"),
                pd.Timestamp("2017-03-28 10:00:00"),
                pd.Timestamp("2017-03-29 12:15:00"),
                pd.Timestamp("2017-03-29 11:45:00"),
            ],
            "geom": [None, None, None, None, None, None],
        }
    )


@pytest.fixture
def historic_missions() -> pd.DataFrame:
    return historic_missions_df


@pytest.fixture
def transformed_historic_missions() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "id": [
                10023 - 100000,
                10037 - 100000,
                10038 - 100000,
                10043 - 100000,
                10045 - 100000,
                10047 - 100000,
                10050 - 100000,
            ],
            "mission_types": [
                ["SEA"],
                ["SEA"],
                ["LAND"],
                ["SEA"],
                ["LAND"],
                ["AIR"],
                ["LAND"],
            ],
            "open_by": ["JBL", "GYT", "RIO", "CBG", "LEG", "RIO", "CRO"],
            "observations_cacem": [
                "91 pàp pro contrôlés/ 4 pàp pro en infraction surquotas",
                "Surveillance: protection des aires marines / protection des espèces sensibles dont perturbation intentionnelle des espèces protégées  RAS",
                None,
                "contrôle de 3 pêcheurs plaisanciers : RAS",
                None,
                "pas pris la commune lors de la déclaration",
                None,
            ],
            "facade": ["NAMO", "MED", "NAMO", "NAMO", "NAMO", "NAMO", "MED"],
            "start_datetime_utc": [
                pd.Timestamp("29/03/2017 11:45:00"),
                pd.Timestamp("30/03/2017 07:00:00"),
                pd.Timestamp("06/04/2017 09:00:00"),
                pd.Timestamp("09/04/2017 10:45:00"),
                pd.Timestamp("15/04/2017 10:00:00"),
                pd.Timestamp("17/04/2017 08:00:00"),
                pd.Timestamp("22/04/2017 07:30:00"),
            ],
            "end_datetime_utc": [
                pd.Timestamp("29/03/2017 16:00:00"),
                pd.Timestamp("30/03/2017 10:30:00"),
                pd.Timestamp("06/04/2017 13:15:00"),
                pd.Timestamp("09/04/2017 11:10:00"),
                pd.Timestamp("15/04/2017 18:00:00"),
                pd.Timestamp("17/04/2017 13:30:00"),
                pd.Timestamp("22/04/2017 10:30:00"),
            ],
            "closed_by": ["VSQ", "VSQ", "GYT", "RIO", "CBG", "VSQ", "VSQ"],
            "mission_nature": [
                "{ENV}",
                "{ENV}",
                "{ENV}",
                "{ENV}",
                "{ENV}",
                "{ENV}",
                "{ENV}",
            ],
            "mission_source": [
                "POSEIDON_CACEM",
                "POSEIDON_CACEM",
                "POSEIDON_CACEM",
                "POSEIDON_CACEM",
                "POSEIDON_CACEM",
                "POSEIDON_CACEM",
                "POSEIDON_CACEM",
            ],
            "closed": [True, True, True, True, False, True, True],
            "observations_cnsp": [None, None, None, None, None, None, None],
            "deleted": [False, False, False, False, False, False, False],
            "geom": [None, None, None, None, None, None, None],
        }
    )


@pytest.fixture
def historic_missions_units() -> pd.DataFrame:
    return historic_missions_units_df


@pytest.fixture
def transformed_missions_units() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "mission_id": [
                11488 - 100000,
                11489 - 100000,
                11490 - 100000,
                11492 - 100000,
                11495 - 100000,
                11496 - 100000,
                11501 - 100000,
            ],
            "control_unit_id": [102, 102, 102, 12, 116, 20, 1037],
        }
    )


def is_valid_uuid(uuid_to_test):
    assert isinstance(uuid_to_test, uuid.UUID)


def mock_uuid4() -> uuid.UUID:
    return uuid.UUID("27c395ff-9357-438c-b62b-08861780c33a")


mock_uuid = MagicMock()
mock_uuid.uuid4 = mock_uuid4


@task(checkpoint=False)
def mock_extract_historic_controls_in_flow() -> pd.DataFrame:
    return historic_controls_df


@task(checkpoint=False)
def mock_extract_historic_missions_in_flow() -> pd.DataFrame:
    return historic_controls_df


@task(checkpoint=False)
def mock_extract_historic_missions_units_in_flow() -> pd.DataFrame:
    return historic_controls_df


breakpoint()
flow.replace(
    flow.get_tasks("extract_historic_controls")[0],
    mock_extract_historic_controls_in_flow,
)
flow.replace(
    flow.get_tasks("extract_historic_missions")[0],
    mock_extract_historic_missions_in_flow,
)
flow.replace(
    flow.get_tasks("extract_historic_missions_units")[0],
    mock_extract_historic_missions_units_in_flow,
)


def test_make_env_actions(historic_controls, transformed_historic_controls):
    with patch("src.pipeline.flows.historic_controls.uuid", mock_uuid):
        res = make_env_actions.run(historic_controls)
    breakpoint()
    pd.testing.assert_frame_equal(res, transformed_historic_controls)


def test_env_missions(historic_missions, transformed_historic_missions):
    historic_missions = make_env_missions.run(historic_missions)
    breakpoint()
    pd.testing.assert_frame_equal(
        historic_missions, transformed_historic_missions
    )


def test_env_missions_units(
    historic_missions_units, transformed_missions_units
):
    historic_missions_units = make_env_mission_units.run(
        historic_missions_units
    )
    pd.testing.assert_frame_equal(
        historic_missions_units, transformed_missions_units
    )


def test_flow(
    reset_test_data,
    transformed_historic_controls,
    transformed_historic_missions,
    transformed_missions_units,
):

    query_controls = "SELECT id, mission_id, action_type, value, action_start_datetime_utc, geom FROM env_actions ORDER BY id"
    initial_controls = read_query("monitorenv_remote", query_controls)

    query_missions = "SELECT id, mission_types, open_by, observations_cacem, facade, start_datetime_utc, closed_by, mission_nature, mission_source, closed, observations_cnsp, deleted, geom FROM missions ORDER BY id"
    initial_missions = read_query("monitorenv_remote", query_missions)

    query_missions_units = "SELECT mission_id, control_unit_id FROM missions_control_units ORDER BY id"
    initial_missions_units = read_query(
        "monitorenv_remote", query_missions_units
    )

    load_missions_and_missions_control_units.run(
        transformed_historic_controls,
        transformed_historic_missions,
        transformed_missions_units,
    )
    controls = read_query("monitorenv_remote", query_controls)
    missions = read_query("monitorenv_remote", query_missions)
    missions_units = read_query("monitorenv_remote", query_missions_units)

    initial_controls_ids = set(initial_controls.id)
    controls_ids = set(controls.id)

    initial_missions_ids = set(initial_missions.id)
    missions_ids = set(missions.id)

    initial_missions_units_ids = set(initial_missions_units.id)
    missions_units_ids = set(missions_units.id)

    updated_controls_ids = set(transformed_historic_controls.id)
    updated_missions_ids = set(transformed_historic_missions.id)
    updated_missions_units_ids = set(transformed_missions_units.id)

    assert updated_controls_ids.union(initial_controls_ids) == controls_ids

    assert updated_missions_ids.union(initial_missions_ids) == missions_ids

    assert (
        updated_missions_units_ids.union(initial_missions_units_ids)
        == missions_units_ids
    )

    """
    assert (
        initial_control_units.loc[
            initial_control_units.id == 1315, "name"
        ].values[0]
        == "Unité 1 ancien nom"
    )
    assert (
        control_units.loc[control_units.id == 1315, "name"].values[0]
        == "Unité 1 (historique)"
    )
    """

    # Re-loading the same data should not make any difference
    load_missions_and_missions_control_units.run(
        transformed_historic_controls,
        transformed_historic_missions,
        transformed_missions_units,
    )
    controls_bis = read_query("monitorenv_remote", query_controls)
    missions_bis = read_query("monitorenv_remote", query_missions)
    missions_units_bis = read_query("monitorenv_remote", query_missions_units)

    pd.testing.assert_frame_equal(controls, controls_bis)
    pd.testing.assert_frame_equal(missions, missions_bis)
    pd.testing.assert_frame_equal(missions_units, missions_units_bis)

import uuid
from datetime import datetime
from unittest.mock import MagicMock, patch

import pandas as pd
import pytest
from prefect import task

from src.flows.historic_controls import (
    historic_controls_flow,
    make_env_actions,
    make_env_mission_units,
    make_env_missions,
)
from src.read_query import read_query

historic_controls_df = pd.DataFrame(
    {
        "id": [10009, 10010, 10011, 10012, 10013, 10014, 10015],
        "themes": [
            (
                "Police des espèces protégées et de leurs habitats<separator>"
                "Travaux en milieu marin (dragage, clapage, infrastructures)"
            ),
            "Pêche à pied",
            "Domanialité publique dont circulation",
            "Pêche à pied<separator>Police de la chasse en mer",
            None,
            "Police des aires marines protégées",
            "Pêche à pied",
        ],
        "action_number_of_controls": [5, 1, 2, 70, 16, 42, 16],
        "natinf": [
            None,
            "10041",
            "10080,10010",
            "2785",
            None,
            "2798,10042",
            None,
        ],
        "protected_species": [
            "Flore,Mamifères marins,Oiseaux",
            "Oiseaux,Flore",
            None,
            "Flore",
            None,
            "Oiseaux,Mammifères marins",
            None,
        ],
        "mission_id": [10012, 10013, 10015, 10017, 10018, 10019, 10042],
        "action_start_datetime_utc": [
            datetime(2017, 12, 3, 9, 40),
            datetime(2017, 3, 14, 10),
            datetime(2017, 3, 23, 21),
            datetime(2017, 3, 28, 10),
            datetime(2017, 3, 29, 12, 15),
            datetime(2017, 3, 29, 11, 45),
            datetime(2017, 4, 29, 11, 45),
        ],
        "action_type": [
            "CONTROL",
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
        "id": [10012, 10013, 10015, 10017, 10018, 10019, 10050],
        "mission_type": ["SEA", "SEA", "LAND", "SEA", "LAND", "AIR", "LAND"],
        "open_by": ["JBL", "GYT", "RIO", "CBG", "LEG", "RIO", "CRO"],
        "observations_cacem": [
            "91 pàp pro contrôlés/ 4 pàp pro en infraction surquotas",
            (
                "Surveillance: protection des aires marines / protection des espèces"
                " sensibles dont perturbation intentionnelle des espèces protégées  RAS"
            ),
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
        "completed_by": ["VSQ", "VSQ", "GYT", "RIO", "CBG", "VSQ", "VSQ"],
        "mission_source": [
            "POSEIDON_CACEM",
            "POSEIDON_CACEM",
            "POSEIDON_CACEM",
            "POSEIDON_CACEM",
            "POSEIDON_CACEM",
            "POSEIDON_CACEM",
            "POSEIDON_CACEM",
        ],
    }
)
historic_missions_units_df = pd.DataFrame(
    {
        "mission_id": [10012, 10013, 10015, 10017, 10018, 10019, 10050, 10042],
        "control_unit_id": [
            10005,
            10005,
            10005,
            10011,
            10013,
            10009,
            10010,
            10010,
        ],
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
                            "protected_species": [
                                "Flore",
                                "Mamifères marins",
                                "Oiseaux",
                            ],
                        },
                        {
                            "theme": "Travaux en milieu marin",
                            "protected_species": [
                                "Flore",
                                "Mamifères marins",
                                "Oiseaux",
                            ],
                        },
                    ],
                    "infractions": [],
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
                        },
                        {
                            "theme": "Pêche de loisir",
                            "protected_species": ["Flore"],
                        },
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
                    "themes": [],
                    "infractions": [],
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
        }
    )


@pytest.fixture
def transformed_historic_controls_non_constant_uuid() -> pd.DataFrame:
    temp = transformed_historic_controls
    temp["id"] = temp.apply(lambda x: uuid.uuid4(), axis=1)
    return temp


@pytest.fixture
def historic_missions() -> pd.DataFrame:
    return historic_missions_df


@pytest.fixture
def historic_controls_without_missing_missions(
    historic_missions,
) -> pd.DataFrame:
    return historic_controls_df[
        historic_controls_df.mission_id.isin(historic_missions.id.values)
    ]


@pytest.fixture
def transformed_historic_missions() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "id": [
                10012 - 100000,
                10013 - 100000,
                10015 - 100000,
                10017 - 100000,
                10018 - 100000,
                10019 - 100000,
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
                (
                    "Surveillance: protection des aires marines / protection des "
                    "espèces sensibles dont perturbation intentionnelle des espèces "
                    "protégées  RAS"
                ),
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
            "completed_by": ["VSQ", "VSQ", "GYT", "RIO", "CBG", "VSQ", "VSQ"],
            "mission_source": [
                "POSEIDON_CACEM",
                "POSEIDON_CACEM",
                "POSEIDON_CACEM",
                "POSEIDON_CACEM",
                "POSEIDON_CACEM",
                "POSEIDON_CACEM",
                "POSEIDON_CACEM",
            ],
            "deleted": [False, False, False, False, False, False, False],
        }
    )


@pytest.fixture
def historic_missions_units() -> pd.DataFrame:
    return historic_missions_units_df


@pytest.fixture
def historic_missions_units_without_missing_missions(
    historic_missions,
) -> pd.DataFrame:
    return historic_missions_units_df[
        historic_missions_units_df.mission_id.isin(historic_missions.id.values)
    ]


@pytest.fixture
def transformed_missions_units() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "mission_id": [
                10012 - 100000,
                10013 - 100000,
                10015 - 100000,
                10017 - 100000,
                10018 - 100000,
                10019 - 100000,
                10050 - 100000,
            ],
            "control_unit_id": [
                10005,
                10005,
                10005,
                10011,
                10013,
                10009,
                10010,
            ],
        }
    )


def is_valid_uuid(uuid_to_test):
    assert isinstance(uuid_to_test, uuid.UUID)


def mock_uuid4() -> uuid.UUID:
    return uuid.UUID("27c395ff-9357-438c-b62b-08861780c33a")


mock_uuid = MagicMock()
mock_uuid.uuid4 = mock_uuid4


@task
def mock_extract_historic_controls_in_flow() -> pd.DataFrame:
    return historic_controls_df


@task
def mock_extract_historic_missions_in_flow() -> pd.DataFrame:
    return historic_missions_df


@task
def mock_extract_historic_missions_units_in_flow() -> pd.DataFrame:
    return historic_missions_units_df


def test_make_env_actions(
    historic_controls_without_missing_missions, transformed_historic_controls
):
    with patch("src.flows.historic_controls.uuid", mock_uuid):
        res = make_env_actions(historic_controls_without_missing_missions)
    pd.testing.assert_frame_equal(res, transformed_historic_controls)


def test_env_missions(historic_missions, transformed_historic_missions):
    historic_missions = make_env_missions(historic_missions)
    pd.testing.assert_frame_equal(
        historic_missions, transformed_historic_missions, check_like=True
    )


def test_env_missions_units(
    historic_missions_units_without_missing_missions,
    transformed_missions_units,
):
    historic_missions_units = make_env_mission_units(
        historic_missions_units_without_missing_missions
    )
    pd.testing.assert_frame_equal(
        historic_missions_units, transformed_missions_units
    )


@patch(
    "src.flows.historic_controls.extract_historic_controls",
    mock_extract_historic_controls_in_flow,
)
@patch(
    "src.flows.historic_controls.extract_historic_missions",
    mock_extract_historic_missions_in_flow,
)
@patch(
    "src.flows.historic_controls.extract_historic_missions_units",
    mock_extract_historic_missions_units_in_flow,
)
def test_flow(
    reset_test_data,
    transformed_historic_controls,
    transformed_historic_missions,
    transformed_missions_units,
):

    query_controls = (
        "SELECT id, mission_id, action_type, value, action_start_datetime_utc,"
        " geom FROM env_actions ORDER BY id"
    )
    initial_controls = read_query("monitorenv_remote", query_controls)

    query_missions = (
        "SELECT id, mission_types, open_by, observations_cacem, facade,"
        " start_datetime_utc, completed_by, mission_source,"
        " observations_cnsp, deleted, geom FROM missions ORDER BY id"
    )
    initial_missions = read_query("monitorenv_remote", query_missions)

    query_missions_units = (
        "SELECT id, mission_id, control_unit_id "
        "FROM missions_control_units ORDER BY id"
    )

    query_missions_units_with_mission_source = (
        "SELECT missions_control_units.id, mission_id,"
        " control_unit_id, missions.mission_source "
        "FROM missions_control_units LEFT JOIN missions "
        "ON missions.id=missions_control_units.mission_id ORDER BY id"
    )
    initial_missions_units_with_mission_source = read_query(
        "monitorenv_remote", query_missions_units_with_mission_source
    )

    state = historic_controls_flow(return_state=True)
    assert state.is_completed()

    controls = read_query("monitorenv_remote", query_controls)
    missions = read_query("monitorenv_remote", query_missions)
    missions_units = read_query("monitorenv_remote", query_missions_units)

    initial_missions_ids_poseidon = set(
        initial_missions.id[
            initial_missions.mission_source == "POSEIDON_CACEM"
        ]
    )
    initial_missions_ids_no_poseidon = set(
        initial_missions.id[
            initial_missions.mission_source != "POSEIDON_CACEM"
        ]
    )

    # test datas to load controls
    initial_controls_time = set(initial_controls.action_start_datetime_utc)
    test_controls_time = set(
        transformed_historic_controls.action_start_datetime_utc
    )
    updated_controls_time = set(controls.action_start_datetime_utc)

    # test datas to load missions
    test_missions_ids = set(transformed_historic_missions.id)
    updated_missions_ids = set(missions.id)

    # test datas to load missions_units
    initial_missions_units_with_mission_source_ids_poseidon = set(
        initial_missions_units_with_mission_source.mission_id[
            initial_missions_units_with_mission_source.mission_source
            == "POSEIDON_CACEM"
        ]
    )
    initial_missions_units_with_mission_source_ids_no_poseidon = set(
        initial_missions_units_with_mission_source.mission_id[
            initial_missions_units_with_mission_source.mission_source
            != "POSEIDON_CACEM"
        ]
    )

    updated_control_unit_missions_ids = set(missions_units.mission_id)
    test_control_unit_missions_ids = set(transformed_missions_units.mission_id)

    assert (
        test_controls_time.union(initial_controls_time)
        == updated_controls_time
    )

    print(
        "Ids that should not be in the updated version "
        f"of the missions table : {initial_missions_ids_poseidon}"
    )

    assert -95690 and -95689 not in updated_missions_ids
    assert initial_missions_ids_no_poseidon.issubset(updated_missions_ids)
    assert test_missions_ids.issubset(updated_missions_ids)

    print(
        "Ids that should not be in the updated version of"
        " the control_unit table : "
        f"{initial_missions_units_with_mission_source_ids_poseidon}"
    )

    assert -95690 and -95689 not in updated_control_unit_missions_ids
    assert initial_missions_units_with_mission_source_ids_no_poseidon.issubset(
        updated_control_unit_missions_ids
    )
    assert test_control_unit_missions_ids.issubset(
        updated_control_unit_missions_ids
    )

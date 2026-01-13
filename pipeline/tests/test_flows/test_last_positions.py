from datetime import datetime

import pandas as pd
import pytest

from src.flows.last_positions import (
    extract_last_positions,
    extract_previous_last_positions,
    last_positions_flow,
    load_last_positions,
    validate_action,
)
from src.read_query import read_query

def test_extract_previous_last_positions(reset_test_data):
    previous_last_positions = extract_previous_last_positions()
    assert previous_last_positions.shape == (6, 9)


def test_extract_last_positions(reset_test_data):
    last_positions = extract_last_positions(minutes=15)
    assert last_positions.shape == (2, 9)

    last_positions = extract_last_positions(minutes=35)
    assert last_positions.shape == (4, 9)



def test_load_last_positions(reset_test_data):
    last_positions_to_load = pd.DataFrame(
        {
            "id": [13639642, 13640935],
            "vessel_id": [1, None],
            "mmsi": [123456789, 987654321],
            "coord": ["POINT(-2.7335 47.6078)", "POINT(-2.7335 47.6078)"],
            "speed": [1, 0],
            "course": [302, 0],
            "heading": [1, 0],
            "ts": [
                datetime(2021, 12, 5, 11, 52, 32),
                datetime(2018, 12, 5, 11, 52, 32),
            ],
        }
    )
    load_last_positions(last_positions_to_load)


def test_validate_action():
    assert validate_action("update") == "update"
    assert validate_action("replace") == "replace"
    with pytest.raises(ValueError):
        validate_action("unknown_option")

def test_last_positions_flow_resets_last_positions_when_action_is_replace(
    reset_test_data,
):
    initial_last_positions = read_query(
        query = "SELECT * FROM last_positions;", db="monitorenv_remote"
    )

    state = last_positions_flow(
        action="replace",
        minutes=1200,
        return_state=True,
    )
    assert state.is_completed()

    final_last_positions = read_query(
        query = "SELECT * FROM last_positions;", db="monitorenv_remote"
    )

    assert len(initial_last_positions) == 6
    assert len(final_last_positions) == 4
    assert set(final_last_positions.mmsi) == {
        545437273,
        755136766,
        92030123,
        883168729,
    }
    assert set(final_last_positions.vessel_id.dropna()) == {
        1,
        2,
    }


def test_last_positions_flow_updates_last_positions_when_action_is_update(
    reset_test_data,
):
    initial_last_positions = read_query(
        query = "SELECT * FROM last_positions;", db="monitorenv_remote"
    )

    state = last_positions_flow(
        action="update",
        minutes=35,
        return_state=True,
    )
    assert state.is_completed()

    final_last_positions = read_query(
        query = "SELECT * FROM last_positions;", db="monitorenv_remote"
    )

    assert len(initial_last_positions) == 6
    assert len(final_last_positions) == 6
    assert set(initial_last_positions.mmsi) == {
        545437273,
        755136766,
        92030123,
        883168729,
        851385830,
        598693403
    }
    assert set(final_last_positions.vessel_id.dropna()) == {
        1,
        2,
        5,
        6
    }

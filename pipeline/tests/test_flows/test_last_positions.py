from datetime import datetime, timedelta
import pdb
from unittest.mock import patch

import pandas as pd
import geopandas as gpd
import pytest

from src.flows.last_positions import (
    drop_duplicates,
    drop_unchanged_new_last_positions,
    extract_last_positions,
    extract_previous_last_positions,
    last_positions_flow,
    load_last_positions,
    split,
    validate_action,
)
from src.read_query import read_query

def test_extract_previous_last_positions(reset_test_data):
    previous_last_positions = extract_previous_last_positions()
    assert previous_last_positions.shape == (6, 9)


def test_extract_last_positions(reset_test_data):
    last_positions = extract_last_positions(minutes=15)
    assert last_positions.shape == (2, 8)

    last_positions = extract_last_positions(minutes=35)
    assert last_positions.shape == (4, 8)



def test_load_last_positions(reset_test_data):
    last_positions_to_load = pd.DataFrame(
        {
            "id": [13639642, 13640935],
            "vessel_id": [1, None],
            "mmsi": [123456789, 987654321],
            "coord": ["POINT(-2.7335 47.6078)", "POINT(-2.7335 47.6078)"],
            "speed": [1.0, 0.0],
            "course": [302.0, 0.0],
            "heading": [1.0, 0.0],
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


def test_drop_duplicates():
    positions = pd.DataFrame(
        {
            "id": [13639642, 13639643, 13640935],
            "vessel_id": [1, 1, 2],
            "mmsi": [123456789, 123456789, 987654321],
            "coord": ["POINT(-2.7335 47.6078)", "POINT(-2.8001 47.6078)", "POINT(-2.7335 47.6078)"],
            "speed": [1.0, 2.0, 0.0],
            "course": [302.0, 100.0, 0.0],
            "heading": [1.0, 0.0, 0.0],
            "ts": [
                datetime(2021, 12, 5, 11, 52, 32),
                datetime(2021, 12, 5, 12, 52, 32),
                datetime(2018, 12, 5, 11, 52, 32),
            ],
        }
    )

    res = drop_duplicates(positions)
    # Drop position[0]
    expected_res = positions.iloc[[1, 2]]
    pd.testing.assert_frame_equal(res, expected_res)


def test_drop_unchanged_new_last_positions():
    previous_last_positions = pd.DataFrame(
        {
            "id": [1, 2, 3, 4],
            "vessel_id": ["A", "B", "C", "D"],
            "some": [1.1, 0.2, -5.65, 1],
            "more": ["b", "c", "d", "a"],
            "data": [None, None, None, None],
        }
    )

    new_last_positions = pd.DataFrame(
        {
            "id": [4, 5, 6],
            "vessel_id": ["D", "E", "A"],
            "some": [1.8, 2.2, -1.1],
            "more": ["a", "d", "f"],
            "data": [None, 42, ""],
        }
    )

    expected_res = pd.DataFrame(
        {
            "id": [5, 6],
            "vessel_id": ["E", "A"],
            "some": [2.2, -1.1],
            "more": ["d", "f"],
            "data": [42, ""],
        }
    )

    res = drop_unchanged_new_last_positions(new_last_positions, previous_last_positions)

    assert list(res) == list(expected_res)
    assert res.values.tolist() == expected_res.values.tolist()


def test_split():
    previous_last_positions = pd.DataFrame(
        {
            "vessel_id": [1, 2, 3],
            "mmsi": [123456789, 123456788, 987654321],
            "coord": ["POINT(-2.7335 47.6078)", "POINT(-2.8001 47.6078)", "POINT(-2.7335 47.6078)"],
            "speed": [1.0, 2.0, 0.0],
            "course": [302.0, 100.0, 0.0],
            "heading": [1.0, 0.0, 0.0],
            "ts": [
                datetime(2021, 12, 5, 11, 52, 32),
                datetime(2021, 12, 5, 11, 52, 32),
                datetime(2018, 12, 5, 11, 52, 32),
            ],
        }
    )

    new_last_positions = pd.DataFrame(
        {
            "vessel_id": [1, 2, None, 12],
            "mmsi": [123456789, 123456788, 222222222, 333333333],
            "coord": ["POINT(-2.7335 47.6078)", "POINT(-2.8001 47.6078)", "POINT(-2.800 47.6078)", "POINT(-2.7336 47.6078)"],
            "speed": [1.0, 2.0, 2.0, 0.0],
            "course": [302.0, 100.0, 100.0, 0.0],
            "heading": [1.0, 0.0, 0.0, 0.0],
            "ts": [
                datetime(2021, 12, 5, 12, 52, 32),
                datetime(2021, 12, 5, 12, 52, 32),
                datetime(2021, 12, 5, 12, 52, 32),
                datetime(2018, 12, 5, 12, 52, 32),
            ],
        }
    )

    (
        unchanged_previous_last_positions,
        new_vessels_last_positions,
        last_positions_to_update,
    ) = split(previous_last_positions, new_last_positions)

    expected_last_positions_to_update = pd.DataFrame(
        {
            "vessel_id": [1, 2],
            "mmsi": [123456789, 123456788],
            "coord": ["POINT(-2.7335 47.6078)", "POINT(-2.8001 47.6078)"],
            "speed": [1.0, 2.0],
            "course": [302.0, 100.0],
            "heading": [1.0, 0.0],
            "ts": [
                datetime(2021, 12, 5, 12, 52, 32),
                datetime(2021, 12, 5, 12, 52, 32)
            ],
        }
    )

    expected_new_vessels_last_positions = new_last_positions.iloc[[2, 3]]

    expected_unchanged_previous_last_positions = previous_last_positions.iloc[[2]]

    pd.testing.assert_frame_equal(
        unchanged_previous_last_positions,
        expected_unchanged_previous_last_positions,
    )

    pd.testing.assert_frame_equal(
        new_vessels_last_positions, expected_new_vessels_last_positions
    )

    pd.testing.assert_frame_equal(
        last_positions_to_update, expected_last_positions_to_update, check_dtype=False
    )

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

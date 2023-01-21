from unittest.mock import patch

import pandas as pd
import pytest
import sqlalchemy

from src.pipeline.flows.historic_control_units import (
    check_id_range,
    extract_historic_control_units,
    load_historic_control_units,
    transform_control_units,
)
from src.read_query import read_query
from tests.mocks import mock_extract_side_effect


@pytest.fixture
def historic_control_units() -> pd.DataFrame:

    return pd.DataFrame(
        {
            "id": [1315, 1, 1401, 62, 1485],
            "administration_id": [1011, 3, 4, 10, 4],
            "name": [
                "Administration 1",
                "Police de la pêche de poissons qui nagent",
                "Les Barbouzes",
                "Administration 2",
                "Administration 3",
            ],
        }
    )


@pytest.fixture
def transformed_control_units() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "id": [1315, 1, 1401, 62, 1485],
            "administration_id": [1011, 3, 4, 10, 4],
            "name": [
                "Administration 1 (historique)",
                "Police de la pêche de poissons qui nagent (historique)",
                "Les Barbouzes (historique)",
                "Administration 2 (historique)",
                "Administration 3 (historique)",
            ],
            "deleted": [True, True, True, True, True],
        }
    )


@patch("src.pipeline.flows.historic_control_units.extract")
def test_extract_historic_control_units(mock_extract):
    mock_extract.side_effect = mock_extract_side_effect
    query = extract_historic_control_units.run()
    assert isinstance(query, sqlalchemy.sql.elements.TextClause)


def test_transform_control_units(
    historic_control_units, transformed_control_units
):
    control_units = transform_control_units.run(historic_control_units)
    pd.testing.assert_frame_equal(control_units, transformed_control_units)


def test_check_id_range_returns_input_when_test_passes(
    transformed_control_units,
):
    control_units = check_id_range.run(transformed_control_units, max_id=10000)
    pd.testing.assert_frame_equal(control_units, transformed_control_units)


def test_check_id_range_raises_value_error_when_test_fails(
    transformed_control_units,
):
    with pytest.raises(ValueError):
        check_id_range.run(transformed_control_units, max_id=1000)


def test_load_control_units(reset_test_data, transformed_control_units):

    query = "SELECT * FROM control_units ORDER BY id"
    initial_control_units = read_query("monitorenv_remote", query)

    load_historic_control_units.run(transformed_control_units)
    control_units = read_query("monitorenv_remote", query)
    assert len(control_units) == len(initial_control_units) + len(
        transformed_control_units
    )

    # Re-loading the same data should not make any difference
    load_historic_control_units.run(transformed_control_units)
    control_units_bis = read_query("monitorenv_remote", query)
    pd.testing.assert_frame_equal(control_units, control_units_bis)

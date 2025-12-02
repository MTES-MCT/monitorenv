from unittest.mock import patch

import pandas as pd
import pytest
import sqlalchemy

from src.flows.historic_control_units import (
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
            "id": [1315, 1, 1401, 62, 1485, 1486, 1487],
            "administration_id": [1011, 3, 4, 10, 4, 4, 3],
            "name": [
                "Unité 1",
                "Police de la pêche de poissons qui nagent",
                "Les Barbouzes",
                "Unité 2",
                "Unité 3",
                "Unité 3",
                "Unité 3",
            ],
        }
    )


@pytest.fixture
def transformed_control_units() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "id": [1315, 1, 1401, 62, 1485, 1486, 1487],
            "administration_id": [1011, 3, 4, 10, 4, 4, 3],
            "name": [
                "Unité 1 (historique)",
                "Police de la pêche de poissons qui nagent (historique)",
                "Les Barbouzes (historique)",
                "Unité 2 (historique)",
                "Unité 3 (historique)",
                "Unité 3 [2] (historique)",
                "Unité 3 [3] (historique)",
            ],
            "archived": [True, True, True, True, True, True, True],
        }
    )


@patch("src.flows.historic_control_units.extract")
def test_extract_historic_control_units(mock_extract):
    mock_extract.side_effect = mock_extract_side_effect
    query = extract_historic_control_units()
    assert isinstance(query, sqlalchemy.sql.elements.TextClause)


def test_transform_control_units(
    historic_control_units, transformed_control_units
):
    control_units = transform_control_units(historic_control_units)
    pd.testing.assert_frame_equal(control_units, transformed_control_units)


def test_check_id_range_returns_input_when_test_passes(
    transformed_control_units,
):
    control_units = check_id_range(transformed_control_units, max_id=10000)
    pd.testing.assert_frame_equal(control_units, transformed_control_units)


def test_check_id_range_raises_value_error_when_test_fails(
    transformed_control_units,
):
    with pytest.raises(ValueError):
        check_id_range(transformed_control_units, max_id=1000)


def test_load_control_units(reset_test_data, transformed_control_units):
    query = "SELECT * FROM control_units ORDER BY id"
    initial_control_units = read_query("monitorenv_remote", query)

    load_historic_control_units(transformed_control_units)
    control_units = read_query("monitorenv_remote", query)

    initial_control_units_ids = set(initial_control_units.id)
    control_units_ids = set(control_units.id)
    updated_control_units_ids = set(transformed_control_units.id)

    assert (
        updated_control_units_ids.union(initial_control_units_ids)
        == control_units_ids
    )
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

    # Re-loading the same data should not make any difference
    load_historic_control_units(transformed_control_units)
    control_units_bis = read_query("monitorenv_remote", query)
    pd.testing.assert_frame_equal(
        # Ignore both `created_at_utc` and `updated_at_utc` since they are "on time"
        control_units.drop(columns=["created_at_utc", "updated_at_utc"]),
        control_units_bis.drop(columns=["created_at_utc", "updated_at_utc"]),
        check_like=True,
    )

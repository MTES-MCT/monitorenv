from datetime import datetime
from uuid import UUID

import pandas as pd
import pytest

from src.read_query import read_query


@pytest.fixture
def analytics_controls_locations() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "action_id": [
                UUID("d8e580fe-8e71-4303-a0c3-a76e1d4e4fc2"),
                UUID("d8e580fe-8e71-4303-a0c3-a76e1d4e4fc2"),
                UUID("b05d96b8-387f-4599-bff0-cd7dab71dfb8"),
            ],
            "action_start_datetime_utc": [
                datetime(2022, 11, 24, 20, 31, 41, 719000),
                datetime(2022, 11, 24, 20, 31, 41, 719000),
                datetime(2022, 11, 17, 13, 59, 51, 108000),
            ],
            "theme": [
                "Aucun thème",
                "Aucun thème",
                (
                    "Activités et manifestations soumises "
                    "à évaluation d’incidence Natura 2000"
                ),
            ],
            "subtheme": [
                "Aucun sous-thème",
                "Aucun sous-thème",
                "Contrôle administratif",
            ],
            "facade": ["NAMO", "NAMO", "MED"],
            "lon": [-3.0564, -2.9822, -2.52],
            "lat": [48.1177, 48.1236, 47.16],
        }
    )


def test_view(reset_test_data, analytics_controls_locations):
    controls_locations = read_query(
        "monitorenv_remote",
        "SELECT * FROM analytics_controls_locations ORDER BY lon",
    )
    pd.testing.assert_frame_equal(
        controls_locations, analytics_controls_locations
    )

from unittest.mock import patch

import pandas as pd
import sqlalchemy

from src.pipeline.flows.natinfs import (
    clean_natinfs,
    extract_natinfs,
    load_natinfs,
)
from tests.mocks import mock_extract_side_effect


@patch("src.pipeline.flows.natinfs.extract")
def test_extract_natinfs(mock_extract):
    mock_extract.side_effect = mock_extract_side_effect
    query = extract_natinfs.run()
    assert isinstance(query, sqlalchemy.sql.elements.TextClause)


def test_clean_natinfs():
    natinfs = pd.DataFrame(
        {
            "infraction": [
                "INFRACTION_1",
                "Infraction numéro 2",
                "T.y.p.e d'infraction",
            ]
        }
    )

    cleaned_natinfs = clean_natinfs.run(natinfs)

    assert cleaned_natinfs.values.tolist() == [
        ["Infraction_1"],
        ["Infraction numéro 2"],
        ["T.y.p.e d'infraction"],
    ]


@patch("src.pipeline.flows.natinfs.load", autospec=True)
def test_load_natinfs(mock_load):
    dummy_natinfs = pd.DataFrame()
    load_natinfs.run(dummy_natinfs)

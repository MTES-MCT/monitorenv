from unittest.mock import patch

import pandas as pd


from src.flows.ref_natinfs import (
    ref_natinfs_flow,
)
from src.read_query import read_query
from tests.mocks import (
    mock_get_csv_file,
)


@patch("src.flows.ref_natinfs.get_csv_file", mock_get_csv_file)
def test_flow_ref_natinfs(create_cacem_tables, reset_test_data):
    state = ref_natinfs_flow(return_state=True)
    assert state.is_completed()

    ref_natinfs = read_query(query = "SELECT * FROM ref_natinfs", db="monitorenv_remote")

    assert len(ref_natinfs) == 6

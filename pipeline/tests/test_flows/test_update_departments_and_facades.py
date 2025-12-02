from uuid import UUID

import pandas as pd

from src.flows.update_departments_and_facades import (
    update_departments_and_facades_flow,
)
from src.read_query import read_query


def test_flow(reset_test_data):

    expected_initial_missions = pd.DataFrame(
        {
            "id": [-95690, -95689, 12, 13, 19, 20],
            "facade": [None, None, "NAMO", "NAMO", "NAMO", "MED"],
        }
    )

    expected_final_missions = pd.DataFrame(
        {
            "id": [-95690, -95689, 12, 13, 19, 20],
            "facade": [None, None, "Facade B", "Facade A", None, None],
        }
    )

    expected_initial_actions = pd.DataFrame(
        {
            "id": [
                UUID("88713755-3966-4ca4-ae18-10cab6249485"),
                UUID("b05d96b8-387f-4599-bff0-cd7dab71dfb8"),
                UUID("d8e580fe-8e71-4303-a0c3-a76e1d4e4fc2"),
                UUID("dedbd2c2-10f5-4d75-8fe9-c50db2ae5d0b"),
                UUID("dfb9710a-2217-4f98-94dc-283d3b7bbaae"),
            ],
            "facade": [None, None, None, None, None],
            "department": [None, None, None, None, None],
        }
    )

    expected_final_actions = pd.DataFrame(
        {
            "id": [
                UUID("88713755-3966-4ca4-ae18-10cab6249485"),
                UUID("b05d96b8-387f-4599-bff0-cd7dab71dfb8"),
                UUID("d8e580fe-8e71-4303-a0c3-a76e1d4e4fc2"),
                UUID("dedbd2c2-10f5-4d75-8fe9-c50db2ae5d0b"),
                UUID("dfb9710a-2217-4f98-94dc-283d3b7bbaae"),
            ],
            "facade": [None, "Facade B", "Facade B", None, "Facade B"],
            "department": [None, "44", "56", None, "85"],
        }
    )

    missions_query = "SELECT id, facade FROM missions ORDER BY id"
    initial_missions = read_query("monitorenv_remote", missions_query)

    actions_query = (
        "SELECT id, facade, department FROM env_actions ORDER BY id"
    )
    initial_actions = read_query("monitorenv_remote", actions_query)

    state = update_departments_and_facades_flow(return_state=True)
    assert state.is_completed()

    final_missions = read_query("monitorenv_remote", missions_query)
    final_actions = read_query("monitorenv_remote", actions_query)

    pd.testing.assert_frame_equal(expected_initial_missions, initial_missions)
    pd.testing.assert_frame_equal(expected_final_missions, final_missions)

    pd.testing.assert_frame_equal(expected_initial_actions, initial_actions)
    pd.testing.assert_frame_equal(expected_final_actions, final_actions)

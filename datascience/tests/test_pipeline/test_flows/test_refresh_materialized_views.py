import pandas as pd
from sqlalchemy import text

from src.db_config import create_engine
from src.pipeline.flows.refresh_materialized_view import flow
from src.read_query import read_query
from tests.mocks import mock_check_flow_not_running

flow.replace(
    flow.get_tasks("check_flow_not_running")[0], mock_check_flow_not_running
)


def test_refresh_analytics_actions(reset_test_data):

    e = create_engine("monitorenv_remote")
    query = text(
        """
        SELECT *
        FROM analytics_actions
        ORDER BY id, control_unit
        """
    )

    initial_actions = read_query("monitorenv_remote", query)

    with e.begin() as connection:
        connection.execute(
            text("DELETE FROM env_actions WHERE mission_id = 12")
        )

    actions_before_refresh = read_query("monitorenv_remote", query)

    flow.schedule = None
    state = flow.run(view_name="analytics_actions", schema="public")

    assert state.is_successful()

    actions_after_refresh = read_query("monitorenv_remote", query)

    assert len(initial_actions) == 7
    assert len(actions_before_refresh) == 7
    assert len(actions_after_refresh) == 1

    pd.testing.assert_frame_equal(initial_actions, actions_before_refresh)
    pd.testing.assert_frame_equal(
        initial_actions.query("mission_id != 12").reset_index(drop=True),
        actions_after_refresh,
        check_dtype=False,
    )

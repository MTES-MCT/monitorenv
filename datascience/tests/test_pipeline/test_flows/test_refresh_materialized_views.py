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
        ORDER BY id, control_unit, theme_level_1, theme_level_2
        """
    )

    initial_actions = read_query("monitorenv_remote", query)

    with e.begin() as connection:
        connection.execute(
            text(
                (
                    "WITH env_actions_to_delete AS ("
                    "   SELECT DISTINCT id "
                    "FROM env_actions "
                    "WHERE mission_id = 12"
                    "), "
                    "deleted_action_themes AS ("
                    "   DELETE FROM themes_env_actions "
                    "   WHERE env_actions_id IN (SELECT id FROM env_actions_to_delete)"
                    ") "
                    "DELETE FROM env_actions WHERE id IN ("
                    "   SELECT id FROM env_actions_to_delete"
                    ")"
                )
            )
        )

    actions_before_refresh = read_query("monitorenv_remote", query)

    flow.schedule = None
    state = flow.run(view_name="analytics_actions", schema="public")

    assert state.is_successful()

    actions_after_refresh = read_query("monitorenv_remote", query)

    assert len(initial_actions) == 9
    assert len(actions_before_refresh) == 9
    assert len(actions_after_refresh) == 3

    pd.testing.assert_frame_equal(initial_actions, actions_before_refresh)
    pd.testing.assert_frame_equal(
        initial_actions.query("mission_id != 12").reset_index(drop=True),
        actions_after_refresh,
        check_dtype=False,
    )


def test_refresh_analytics_surveillance_density_map(reset_test_data):

    e = create_engine("monitorenv_remote")
    query = text(
        """
        SELECT *
        FROM analytics_surveillance_density_map
        ORDER BY action_id, latitude, longitude
        """
    )

    initial_surveillance_density_map = read_query("monitorenv_remote", query)

    with e.begin() as connection:
        connection.execute(
            text(
                (
                    "WITH env_actions_to_delete AS ("
                    "   SELECT DISTINCT id "
                    "FROM env_actions "
                    "WHERE mission_id = 12"
                    "), "
                    "deleted_action_themes AS ("
                    "   DELETE FROM themes_env_actions "
                    "   WHERE env_actions_id IN (SELECT id FROM env_actions_to_delete)"
                    ") "
                    "DELETE FROM env_actions WHERE id IN ("
                    "   SELECT id FROM env_actions_to_delete"
                    ")"
                )
            )
        )

    surveillance_density_map_before_refresh = read_query(
        "monitorenv_remote", query
    )

    flow.schedule = None
    state = flow.run(
        view_name="analytics_surveillance_density_map", schema="public"
    )

    assert state.is_successful()

    surveillance_density_map_after_refresh = read_query(
        "monitorenv_remote", query
    )

    assert len(initial_surveillance_density_map) == 123
    assert len(surveillance_density_map_before_refresh) == 123
    assert len(surveillance_density_map_after_refresh) == 121

    pd.testing.assert_frame_equal(
        initial_surveillance_density_map,
        surveillance_density_map_before_refresh,
    )
    pd.testing.assert_frame_equal(
        initial_surveillance_density_map.query("mission_id != 12").reset_index(
            drop=True
        ),
        surveillance_density_map_after_refresh,
        check_dtype=False,
    )

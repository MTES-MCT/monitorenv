from src.pipeline.flows.control_objectives import flow
from src.read_query import read_query
from tests.mocks import mock_check_flow_not_running

flow.replace(
    flow.get_tasks("check_flow_not_running")[0], mock_check_flow_not_running
)


def test_flow(reset_test_data):

    query = (
        "SELECT * FROM control_objectives ORDER BY target_number_of_controls"
    )
    initial_control_objectives = read_query("monitorenv_remote", query)

    flow.schedule = None
    state = flow.run(file_name="dummy_control_objectives.csv")
    assert state.is_successful()

    final_control_objectives = read_query("monitorenv_remote", query)

    assert len(initial_control_objectives) == 0
    assert len(final_control_objectives) == 16
    assert (final_control_objectives.year == 2023).all()
    assert (
        final_control_objectives.target_number_of_controls == range(1, 17)
    ).all()

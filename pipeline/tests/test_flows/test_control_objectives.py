from src.flows.control_objectives import control_objectives_flow
from src.read_query import read_query


def test_flow(reset_test_data):

    query = (
        "SELECT * FROM control_objectives ORDER BY target_number_of_controls"
    )
    initial_control_objectives = read_query("monitorenv_remote", query)

    state = control_objectives_flow(
        file_name="dummy_control_objectives.csv", return_state=True
    )
    assert state.is_completed()

    final_control_objectives = read_query("monitorenv_remote", query)

    assert len(initial_control_objectives) == 0
    assert len(final_control_objectives) == 16
    assert (final_control_objectives.year == 2023).all()
    assert (
        final_control_objectives.target_number_of_controls == range(1, 17)
    ).all()

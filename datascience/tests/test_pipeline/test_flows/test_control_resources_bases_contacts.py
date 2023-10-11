import pandas as pd

from src.pipeline.flows.control_resources_bases_contacts import flow
from src.read_query import read_query
from tests.mocks import mock_check_flow_not_running

flow.replace(
    flow.get_tasks("check_flow_not_running")[0], mock_check_flow_not_running
)


def test_flow(reset_test_data):

    bases_query = "SELECT id, name, longitude, latitude FROM bases ORDER BY id"
    control_unit_resources_query = "SELECT id, control_unit_id, base_id, name, note, type FROM control_unit_resources ORDER BY id"
    control_unit_contacts_query = "SELECT id, control_unit_id, name, phone, email FROM control_unit_contacts ORDER BY id"

    bases_next_id_query = "SELECT nextval('bases_id_seq')"
    control_unit_resources_next_id_query = (
        "SELECT nextval('control_unit_resources_id_seq')"
    )
    control_unit_contacts_next_id_query = (
        "SELECT nextval('control_unit_contacts_id_seq')"
    )

    flow.schedule = None
    state = flow.run(
        control_unit_resources_file_name="dummy_control_unit_resources.csv",
        control_unit_contacts_file_name="dummy_control_unit_contacts.csv",
        bases_file_name="dummy_bases.csv",
    )
    assert state.is_successful()

    final_bases_1 = read_query("monitorenv_remote", bases_query)
    final_control_unit_resources_1 = read_query(
        "monitorenv_remote", control_unit_resources_query
    )
    final_control_unit_contacts_1 = read_query(
        "monitorenv_remote", control_unit_contacts_query
    )

    bases_next_id = read_query("monitorenv_remote", bases_next_id_query).iloc[
        0, 0
    ]
    control_unit_resources_next_id = read_query(
        "monitorenv_remote", control_unit_resources_next_id_query
    ).iloc[0, 0]
    control_unit_contacts_next_id = read_query(
        "monitorenv_remote", control_unit_contacts_next_id_query
    ).iloc[0, 0]

    assert (
        bases_next_id
        == read_query(
            "monitorenv_remote", "SELECT MAX(id) + 1 FROM bases"
        ).iloc[0, 0]
    )
    assert (
        control_unit_resources_next_id
        == read_query(
            "monitorenv_remote",
            "SELECT MAX(id) + 1 FROM control_unit_resources",
        ).iloc[0, 0]
    )
    assert (
        control_unit_contacts_next_id
        == read_query(
            "monitorenv_remote",
            "SELECT MAX(id) + 1 FROM control_unit_contacts",
        ).iloc[0, 0]
    )

    # Re-running the flow should lead to the same data and sequence situation
    state = flow.run(
        control_unit_resources_file_name="dummy_control_unit_resources.csv",
        control_unit_contacts_file_name="dummy_control_unit_contacts.csv",
        bases_file_name="dummy_bases.csv",
    )
    assert state.is_successful()

    final_bases_2 = read_query("monitorenv_remote", bases_query)
    final_control_unit_resources_2 = read_query(
        "monitorenv_remote", control_unit_resources_query
    )
    final_control_unit_contacts_2 = read_query(
        "monitorenv_remote", control_unit_contacts_query
    )

    bases_next_id = read_query("monitorenv_remote", bases_next_id_query).iloc[
        0, 0
    ]
    control_unit_resources_next_id = read_query(
        "monitorenv_remote", control_unit_resources_next_id_query
    ).iloc[0, 0]
    control_unit_contacts_next_id = read_query(
        "monitorenv_remote", control_unit_contacts_next_id_query
    ).iloc[0, 0]

    assert (
        bases_next_id
        == read_query(
            "monitorenv_remote", "SELECT MAX(id) + 1 FROM bases"
        ).iloc[0, 0]
    )
    assert (
        control_unit_resources_next_id
        == read_query(
            "monitorenv_remote",
            "SELECT MAX(id) + 1 FROM control_unit_resources",
        ).iloc[0, 0]
    )
    assert (
        control_unit_contacts_next_id
        == read_query(
            "monitorenv_remote",
            "SELECT MAX(id) + 1 FROM control_unit_contacts",
        ).iloc[0, 0]
    )

    pd.testing.assert_frame_equal(final_bases_2, final_bases_1),
    pd.testing.assert_frame_equal(
        final_control_unit_resources_2, final_control_unit_resources_1
    )
    pd.testing.assert_frame_equal(
        final_control_unit_contacts_2, final_control_unit_contacts_1
    )

    assert len(final_bases_1) == 7
    assert len(final_control_unit_resources_1) == 17
    assert len(final_control_unit_contacts_1) == 9
    breakpoint()

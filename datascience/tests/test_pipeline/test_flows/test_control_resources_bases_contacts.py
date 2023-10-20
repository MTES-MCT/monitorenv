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
    control_unit_notes_query = (
        "SELECT id, terms_note, area_note FROM control_units ORDER BY id"
    )

    bases_next_id_query = "SELECT nextval('bases_id_seq')"
    control_unit_resources_next_id_query = (
        "SELECT nextval('control_unit_resources_id_seq')"
    )
    control_unit_contacts_next_id_query = (
        "SELECT nextval('control_unit_contacts_id_seq')"
    )

    initial_control_unit_notes = read_query(
        "monitorenv_remote", control_unit_notes_query
    )

    flow.schedule = None
    state = flow.run(
        control_unit_resources_file_name="dummy_control_unit_resources.csv",
        control_unit_contacts_file_name="dummy_control_unit_contacts.csv",
        bases_file_name="dummy_bases.csv",
        area_notes_file_name="dummy_area_notes.csv",
        terms_notes_file_name="dummy_terms_notes.csv",
    )
    assert state.is_successful()

    final_bases_1 = read_query("monitorenv_remote", bases_query)
    final_control_unit_resources_1 = read_query(
        "monitorenv_remote", control_unit_resources_query
    )
    final_control_unit_contacts_1 = read_query(
        "monitorenv_remote", control_unit_contacts_query
    )
    control_unit_notes_1 = read_query(
        "monitorenv_remote", control_unit_notes_query
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
        area_notes_file_name="dummy_area_notes.csv",
        terms_notes_file_name="dummy_terms_notes.csv",
    )
    assert state.is_successful()

    final_bases_2 = read_query("monitorenv_remote", bases_query)
    final_control_unit_resources_2 = read_query(
        "monitorenv_remote", control_unit_resources_query
    )
    final_control_unit_contacts_2 = read_query(
        "monitorenv_remote", control_unit_contacts_query
    )
    control_unit_notes_2 = read_query(
        "monitorenv_remote", control_unit_notes_query
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

    assert len(initial_control_unit_notes) == 35
    assert len(control_unit_notes_1) == 35
    assert len(control_unit_notes_2) == 35
    assert initial_control_unit_notes.area_note.isna().all()
    assert initial_control_unit_notes.terms_note.isna().all()
    assert control_unit_notes_1.area_note.notnull().sum() == 3
    assert control_unit_notes_1.terms_note.notnull().sum() == 2
    assert (
        control_unit_notes_1.loc[
            control_unit_notes_1.id == 10002, "area_note"
        ].values[0]
        == "Nord (59)"
    )
    assert (
        control_unit_notes_1.loc[
            control_unit_notes_1.id == 10002, "terms_note"
        ].values[0]
        == "Centre de commandemant 1"
    )
    pd.testing.assert_frame_equal(control_unit_notes_1, control_unit_notes_2)
    assert len(final_bases_1) == 7
    assert len(final_control_unit_resources_1) == 17
    assert len(final_control_unit_contacts_1) == 9

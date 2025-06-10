import pandas as pd
import prefect
import pytest


from src.pipeline.flows.themes_and_tags import load_new_themes, update_themes, load_new_tags, update_tags, flow
from src.pipeline.generic_tasks import load
from src.read_query import read_query

import pandas as pd
import pytest

""" Thèmes """
def generate_themes_data(ids, names, parents_id, started_at, ended_at, control_plan_themes_id, control_plan_sub_themes_id, control_plan_tags_id, reportings_control_plan_sub_themes_id):
    return pd.DataFrame({
        "id": ids,
        "name": names,
        "parent_id": parents_id,
        "started_at": pd.to_datetime(started_at),
        "ended_at": pd.to_datetime(ended_at),
        "control_plan_themes_id": control_plan_themes_id,
        "control_plan_sub_themes_id": control_plan_sub_themes_id,
        "control_plan_tags_id": control_plan_tags_id,
        "reportings_control_plan_sub_themes_id": reportings_control_plan_sub_themes_id
    })

@pytest.fixture
def new_themes() -> pd.DataFrame:
    return generate_themes_data(
        ids=[991, 992, 993, 994],
        names=["Thème 1_new", "Thème 2", "Thème 3", "Thème 4"],
        parents_id=[991, 991, 992, 993],
        started_at=["2025-10-15 00:00:00", "2025-10-16 00:00:00", "2025-10-19 00:00:00", "2025-10-18 00:00:00"],
        ended_at=["2026-10-15 23:59:59", "2026-10-16 23:59:59", "2026-10-17 23:59:59", "2026-10-28 23:59:59"],
        control_plan_themes_id= [3, 4, 5, 6],
        control_plan_sub_themes_id=[7, 8, 9, 10],
        control_plan_tags_id=[11, 12, 13, 14],
        reportings_control_plan_sub_themes_id=[15, 16, 17, 18],
    )

@pytest.fixture
def old_themes() -> pd.DataFrame:
    return generate_themes_data(
        ids=[991, 992, 993, 994],
        names=["Thème 1", "Thème 2", "Thème 3", "Thème 4"],
        parents_id=[991, 992, 992, 994],
        started_at=["2025-10-15 00:00:00", "2025-10-16 00:00:00", "2025-10-17 00:00:00", "2025-10-18 00:00:00"],
        ended_at=["2026-10-15 23:59:59", "2026-10-16 23:59:59", "2026-10-17 23:59:59", "2026-10-18 23:59:59"],
        control_plan_themes_id= [3, 4, 5, 6],
        control_plan_sub_themes_id=[7, 8, 9, 10],
        control_plan_tags_id=[11, 12, 13, 14],
        reportings_control_plan_sub_themes_id=[15, 16, 17, 18],
    )


def test_load_new_themes(reset_test_data, old_themes):
    load_new_themes.run(old_themes)
    loaded_themes = read_query(
        "monitorenv_remote", 
        """SELECT 
            id, name, parent_id, started_at, ended_at, control_plan_themes_id, control_plan_sub_themes_id, control_plan_tags_id, reportings_control_plan_sub_themes_id
            FROM public.themes
            WHERE id IN (991, 992, 993, 994)
            ORDER BY id"""
    )

    pd.testing.assert_frame_equal(loaded_themes, old_themes)


def test_update_new_themes(reset_test_data, new_themes, old_themes):
    load(
        old_themes,
        table_name="themes",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="append",
    )
    update_themes.run(new_themes)
    updated_themes = read_query(
        "monitorenv_remote", 
        """SELECT 
            id, name, parent_id, started_at, ended_at, control_plan_themes_id, control_plan_sub_themes_id, control_plan_tags_id, reportings_control_plan_sub_themes_id
            FROM public.themes
            WHERE id IN (991, 992, 993, 994)
            ORDER BY id"""
    )
    for col in ["id", "parent_id", "control_plan_themes_id", "control_plan_sub_themes_id", "control_plan_tags_id", "reportings_control_plan_sub_themes_id"]:
        updated_themes[col] = updated_themes[col].astype("Int64")

    pd.testing.assert_frame_equal(updated_themes, new_themes)


""" Tags """
def generate_tags_data(ids, names, parents_id, started_at, ended_at):
    return pd.DataFrame({
        "id": ids,
        "name": names,
        "parent_id": parents_id,
        "started_at": pd.to_datetime(started_at),
        "ended_at": pd.to_datetime(ended_at),
    })

@pytest.fixture
def new_tags() -> pd.DataFrame:
    return generate_tags_data(
        ids=[1, 2, 3, 4],
        names=["Tag 1", "Tag 2_new", "Tag 3", "Tag 4"],
        parents_id=[1, 1, 2, 2],
        started_at=["2025-10-15 00:00:00", "2025-10-16 00:00:00", "2025-10-19 00:00:00", "2025-10-18 00:00:00"],
        ended_at=["2026-10-15 23:59:59", "2026-10-16 23:59:59", "2026-10-17 23:59:59", "2026-10-28 23:59:59"],
    )

@pytest.fixture
def old_tags() -> pd.DataFrame:
    return generate_tags_data(
        ids=[1, 2, 3, 4],
        names=["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
        parents_id=[1, 1, 2, 4],
        started_at=["2025-10-15 00:00:00", "2025-10-16 00:00:00", "2025-10-17 00:00:00", "2025-10-18 00:00:00"],
        ended_at=["2026-10-15 23:59:59", "2026-10-16 23:59:59", "2026-10-17 23:59:59", "2026-10-18 23:59:59"],
    )


def test_load_new_tags(reset_test_data, old_tags):
    load_new_tags.run(old_tags)
    loaded_tags = read_query(
        "monitorenv_remote", 
        """SELECT 
            id, name, parent_id, started_at, ended_at
            FROM public.tags
            ORDER BY id"""
    )

    pd.testing.assert_frame_equal(loaded_tags, old_tags)


def test_update_new_tags(reset_test_data, new_tags, old_tags):
    load(
        old_tags,
        table_name="tags",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="append",
    )
    update_tags.run(new_tags)
    updated_tags = read_query(
        "monitorenv_remote", 
        """SELECT 
            id, name, parent_id, started_at, ended_at
            FROM public.tags
            ORDER BY id"""
    )
    for col in ["id", "parent_id"]:
        updated_tags[col] = updated_tags[col].astype("Int64")
    pd.testing.assert_frame_equal(updated_tags, new_tags)

def test_flow_themes_and_tags(create_cacem_tables):
    state = flow.run()
    assert state.is_successful()
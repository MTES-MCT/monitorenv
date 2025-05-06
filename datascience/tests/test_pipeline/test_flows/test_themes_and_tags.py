import pandas as pd
import prefect
import pytest


from src.pipeline.flows.themes_and_tags import load_new_themes, update_themes, load_new_tags, update_tags
from src.pipeline.generic_tasks import delete_rows, load
from src.pipeline.shared_tasks.update_queries import merge_hashes, select_ids_to_delete, select_ids_to_insert, select_ids_to_update
from src.read_query import read_query

import pandas as pd
import pytest

""" Thèmes """
def generate_themes_data(ids, names, parents_id, started_at, ended_at, row_hashes):
    return pd.DataFrame({
        "id": ids,
        "name": names,
        "parent_id": parents_id,
        "started_at": pd.to_datetime(started_at),
        "ended_at": pd.to_datetime(ended_at),
        "row_hash": row_hashes,
    })

@pytest.fixture
def new_themes() -> pd.DataFrame:
    return generate_themes_data(
        ids=[1, 2, 3, 4],
        names=["Thème 1_new", "Thème 2", "Thème 3", "Thème 4"],
        parents_id=[1, 1, 2, 3],
        started_at=["2025-10-15 00:00:00", "2025-10-16 00:00:00", "2025-10-19 00:00:00", "2025-10-18 00:00:00"],
        ended_at=["2026-10-15 23:59:59", "2026-10-16 23:59:59", "2026-10-17 23:59:59", "2026-10-28 23:59:59"],
        row_hashes=["cacem_row_hash_1", "cacem_row_hash_2", "cacem_row_hash_3", "cacem_row_hash_4"],
    )

@pytest.fixture
def old_themes() -> pd.DataFrame:
    return generate_themes_data(
        ids=[1, 2, 3, 4],
        names=["Thème 1", "Thème 2", "Thème 3", "Thème 4"],
        parents_id=[1, 2, 2, 4],
        started_at=["2025-10-15 00:00:00", "2025-10-16 00:00:00", "2025-10-17 00:00:00", "2025-10-18 00:00:00"],
        ended_at=["2026-10-15 23:59:59", "2026-10-16 23:59:59", "2026-10-17 23:59:59", "2026-10-18 23:59:59"],
        row_hashes=["cacem_row_hash_5", "cacem_row_hash_6", "cacem_row_hash_7", "cacem_row_hash_8"],
    )


def test_load_new_themes(reset_test_data, old_themes):
    load_new_themes.run(old_themes)
    loaded_themes = read_query(
        "monitorenv_remote", 
        """SELECT 
            id, name, parent_id, started_at, ended_at, row_hash
            FROM public.themes
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
            id, name, parent_id, started_at, ended_at, row_hash
            FROM public.themes
            ORDER BY id"""
    )
    pd.testing.assert_frame_equal(updated_themes, new_themes)


""" Tags """
def generate_tags_data(ids, names, parents_id, started_at, ended_at, row_hashes):
    return pd.DataFrame({
        "id": ids,
        "name": names,
        "parent_id": parents_id,
        "started_at": pd.to_datetime(started_at),
        "ended_at": pd.to_datetime(ended_at),
        "row_hash": row_hashes,
    })

@pytest.fixture
def new_tags() -> pd.DataFrame:
    return generate_tags_data(
        ids=[1, 2, 3, 4],
        names=["Tag 1", "Tag 2_new", "Tag 3", "Tag 4"],
        parents_id=[1, 1, 2, 2],
        started_at=["2025-10-15 00:00:00", "2025-10-16 00:00:00", "2025-10-19 00:00:00", "2025-10-18 00:00:00"],
        ended_at=["2026-10-15 23:59:59", "2026-10-16 23:59:59", "2026-10-17 23:59:59", "2026-10-28 23:59:59"],
        row_hashes=["cacem_row_hash_1", "cacem_row_hash_2", "cacem_row_hash_3", "cacem_row_hash_4"],
    )

@pytest.fixture
def old_tags() -> pd.DataFrame:
    return generate_tags_data(
        ids=[1, 2, 3, 4],
        names=["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
        parents_id=[1, 1, 2, 4],
        started_at=["2025-10-15 00:00:00", "2025-10-16 00:00:00", "2025-10-17 00:00:00", "2025-10-18 00:00:00"],
        ended_at=["2026-10-15 23:59:59", "2026-10-16 23:59:59", "2026-10-17 23:59:59", "2026-10-18 23:59:59"],
        row_hashes=["cacem_row_hash_5", "cacem_row_hash_6", "cacem_row_hash_7", "cacem_row_hash_8"],
    )


def test_load_new_tags(reset_test_data, old_tags):
    load_new_tags.run(old_tags)
    loaded_tags = read_query(
        "monitorenv_remote", 
        """SELECT 
            id, name, parent_id, started_at, ended_at, row_hash
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
            id, name, parent_id, started_at, ended_at, row_hash
            FROM public.tags
            ORDER BY id"""
    )
    pd.testing.assert_frame_equal(updated_tags, new_tags)

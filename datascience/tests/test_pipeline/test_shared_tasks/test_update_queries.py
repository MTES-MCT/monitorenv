
import pandas as pd
import pytest
from src.pipeline.shared_tasks.update_queries import merge_hashes, select_ids_to_delete, select_ids_to_insert, select_ids_to_update

@pytest.fixture
def local_hashes() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "id": [1, 2, 3, 4, 6],
            "cacem_row_hash": [
                "cacem_row_hash_1",
                "cacem_row_hash_2",
                "cacem_row_hash_3",
                "cacem_row_hash_4_new",
                "cacem_row_hash_6",
            ],
        }
    )

@pytest.fixture
def remote_hashes() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "id": [1, 2, 3, 4, 5],
            "monitorenv_row_hash": [
                "cacem_row_hash_1",
                "cacem_row_hash_2",
                "cacem_row_hash_3",
                "cacem_row_hash_4",
                "cacem_row_hash_5",
            ],
        }
    )

def test_select_ids_to_delete(remote_hashes, local_hashes):
    hashes = merge_hashes.run(local_hashes, remote_hashes)
    ids_to_delete = select_ids_to_delete.run(hashes)
    assert ids_to_delete == {5}


def test_select_ids_to_update(remote_hashes, local_hashes):
    hashes = merge_hashes.run(local_hashes, remote_hashes, "inner")
    ids_to_update = select_ids_to_update.run(hashes)
    assert ids_to_update == {4}

def test_select_ids_to_insert(remote_hashes, local_hashes):
    hashes = merge_hashes.run(local_hashes, remote_hashes)
    ids_to_insert = select_ids_to_insert.run(hashes)
    assert ids_to_insert == {6}
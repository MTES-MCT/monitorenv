import pandas as pd
import pytest

from src.pipeline.flows.regulations import (
    load_new_regulations,
    merge_hashes,
    select_ids_to_delete,
    select_ids_to_update,
)
from src.read_query import read_query


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


def test_select_ids_to_upsert(remote_hashes, local_hashes):
    hashes = merge_hashes.run(local_hashes, remote_hashes)
    ids_to_upsert = select_ids_to_update.run(hashes)
    assert ids_to_upsert == {4, 6}


@pytest.fixture
def new_regulations() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "id": [1, 2, 3, 4],
            "geom": [
                "0106000020E610000001000000010300000001000000040000001EA36CE84A6F04C028FCC"
                "F619D7F47407B5A4C4F4F6904C06878344D997F4740906370C20E6A04C050111641647F47"
                "401EA36CE84A6F04C028FCCF619D7F4740",
                "0106000020E61000000100000001030000000100000004000000508B8D44B1B304C014238"
                "1B3F47F4740A374D56D789004C0C0F2BF049B7F474033F02B2558B104C0CCA0D40BEE7E47"
                "40508B8D44B1B304C0142381B3F47F4740",
                "0106000020E61000000100000001030000000100000004000000D2204A8709EBE33F541AC"
                "4E69B024940B8BC1FBE94F2E33F387D124AAF02494021642107D81FE43F387D124AAF0249"
                "40D2204A8709EBE33F541AC4E69B024940",
                "0106000020E61000000100000001030000000100000004000000F57994631533F2BFE2B98"
                "CD5455446407A715E737969F3BFEAD7CEDEB655464036ED5A29A137F4BF97F69352CC3446"
                "40F57994631533F2BFE2B98CD545544640",
            ],
            "entity_name": [
                "Zone 1",
                "Zone 2",
                "Zone 3'",
                "Zone 4",
            ],
            "layer_name": [
                "Layer 1",
                "Layer 2",
                "Layer 3",
                "Layer 4",
            ],
            "facade": [
                "NAMO",
                "NAMO",
                "MED",
                "MED"
            ],
            "ref_reg": [
                "arrêté 1",
                "arrêté 2",
                "arrêté 3",
                "arrêté 4",
            ],
            "url": [
                "http://dummy_url_1",
                "http://dummy_url_2",
                "http://dummy_url_3",
                "http://dummy_url_4",
            ],
            "row_hash": [
                "cacem_row_hash_1",
                "cacem_row_hash_2",
                "cacem_row_hash_3",
                "cacem_row_hash_4_new",
            ],
        }
    )


def test_load_new_regulations(new_regulations):
    load_new_regulations.run(new_regulations)
    load_new_regulations = read_query(
        "monitorenv_remote", 
        "SELECT id, geom, "
            "mpa_oriname, des_desigfr, "
            "mpa_type, ref_reg, "
            "url_legicem, row_hash "
            "FROM amp_cacem "
            "ORDER BY id"
    )

    pd.testing.assert_frame_equal(load_new_regulations, new_regulations)

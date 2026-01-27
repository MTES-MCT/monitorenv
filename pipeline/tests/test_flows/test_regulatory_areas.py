import pandas as pd
from pipeline.src.flows.regulatory_areas import load_new_regulatory_areas, regulatory_areas_flow, update_regulatory_areas, flow
import prefect
import pytest
from src.read_query import read_query


def generate_regulatory_area_data(ids, geom, ref_regs, row_hashes, editions_cacem):
    return pd.DataFrame({
        "id": ids,
        "geom": geom,
        "ref_reg": ref_regs,
        "row_hash": row_hashes,
        "edition_cacem": editions_cacem
    })

@pytest.fixture
def new_regulatory_areas() -> pd.DataFrame:
    return generate_regulatory_area_data(
        ids=[3, 4, 5, 6],
        geom=[
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
        ref_regs=["arrêté 1", "arrêté 2", "arrêté 3", "arrêté 4_new"],
        row_hashes=["cacem_row_hash_1", "cacem_row_hash_2", "cacem_row_hash_3", "cacem_row_hash_4"],
        editions_cacem=["2021-10-14", "2021-10-14", "2021-10-14", None],
    )

@pytest.fixture
def regulatory_areas_to_update() -> pd.DataFrame:
    return generate_regulatory_area_data(
        ids=[1, 2],
        geom=[
            None,
            None,
        ],
        ref_regs=["arrêté 5", "arrêté 6"],
        row_hashes=["cacem_row_hash_5", "cacem_row_hash_6"],
        editions_cacem=["2021-10-15", "2021-10-16",],
    )


def test_load_new_regulatory_areas(reset_test_data, new_regulatory_areas):
    old_regulations = read_query(
        "monitorenv_remote",
        """SELECT 
            id, geom, ref_reg, row_hash, edition_cacem
            FROM public.regulatory_areas
            ORDER BY id"""
    )

    expectedRegulations = pd.concat([old_regulations, new_regulatory_areas], ignore_index=True)
    load_new_regulatory_areas(new_regulatory_areas)
    loaded_regulations = read_query(
        "monitorenv_remote", 
        """SELECT 
            id, geom, ref_reg, row_hash, edition_cacem
            FROM public.regulatory_areas
            ORDER BY id"""
    )
    pd.testing.assert_frame_equal(loaded_regulations, expectedRegulations)


def test_update_new_regulatory_areas(reset_test_data, regulatory_areas_to_update):
    update_regulatory_areas(regulatory_areas_to_update)
    updated_regulations = read_query(
        "monitorenv_remote", 
        """SELECT 
            id, geom, ref_reg, row_hash, edition_cacem
            FROM public.regulatory_areas
            ORDER BY id"""
    )
    pd.testing.assert_frame_equal(updated_regulations, regulatory_areas_to_update)


def test_flow_regulatory_areas(create_cacem_tables, reset_test_data):
    state = regulatory_areas_flow(return_state=True)
    assert state.is_completed()
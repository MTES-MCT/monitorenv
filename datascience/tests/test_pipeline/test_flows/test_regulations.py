import pandas as pd
import prefect
import pytest


from src.pipeline.flows.regulations import load_new_regulations, update_regulations,load_themes_regulatory_areas, load_tags_regulatory_areas, flow
from src.pipeline.flows.themes_and_tags import load_new_tags, load_new_themes
from src.pipeline.generic_tasks import load
from src.read_query import read_query

import pandas as pd
import pytest

from tests.test_pipeline.test_flows.test_themes_and_tags import generate_tags_data, generate_themes_data

""" Thèmes """
@pytest.fixture
def new_themes() -> pd.DataFrame:
    return generate_themes_data(
        ids=[1, 2, 3, 4],
        names=["Thème 1_new", "Thème 2", "Thème 3", "Thème 4"],
        parents_id=[1, 1, 2, 3],
        started_at=["2025-10-15 00:00:00", "2025-10-16 00:00:00", "2025-10-19 00:00:00", "2025-10-18 00:00:00"],
        ended_at=["2026-10-15 23:59:59", "2026-10-16 23:59:59", "2026-10-17 23:59:59", "2026-10-28 23:59:59"],
        control_plan_themes_id= [3, 4, 5, 6],
        control_plan_sub_themes_id=[7, 8, 9, 10],
        control_plan_tags_id=[11, 12, 13, 14],
        reportings_control_plan_sub_themes_id=[15, 16, 17, 18],
    )

@pytest.fixture
def new_tags() -> pd.DataFrame:
    return generate_tags_data(
        ids=[1, 2, 3, 4],
        names=["Tag 1", "Tag 2_new", "Tag 3", "Tag 4"],
        parents_id=[1, 1, 2, 2],
        started_at=["2025-10-15 00:00:00", "2025-10-16 00:00:00", "2025-10-19 00:00:00", "2025-10-18 00:00:00"],
        ended_at=["2026-10-15 23:59:59", "2026-10-16 23:59:59", "2026-10-17 23:59:59", "2026-10-28 23:59:59"],
    )

def generate_regulatory_area_data(ids, geom, entity_names, layer_names, facades, ref_regs, urls, row_hashes, editions, editeurs, sources, observations, thematiques, dates, duree_validites, temporalites, types):
    return pd.DataFrame({
        "id": ids,
        "geom": geom,
        "entity_name": entity_names,
        "layer_name": layer_names,
        "facade": facades,
        "ref_reg": ref_regs,
        "url": urls,
        "row_hash": row_hashes,
        "edition": editions,
        "editeur": editeurs,
        "source": sources,
        "observation": observations,
        "thematique": thematiques,
        "date": dates,
        "duree_validite": duree_validites,
        "temporalite": temporalites,
        "type": types
    })

def generate_themes_regulatory_area_data(themes_id, regulatory_areas_id):
    return pd.DataFrame({
        "themes_id": themes_id,
        "regulatory_areas_id": regulatory_areas_id,
    })

def generate_tags_regulatory_area_data(tags_id, regulatory_areas_id):
    return pd.DataFrame({
        "tags_id": tags_id,
        "regulatory_areas_id": regulatory_areas_id,
    })

@pytest.fixture
def new_regulatory_areas() -> pd.DataFrame:
    return generate_regulatory_area_data(
        ids=[1, 2, 3, 4],
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
        entity_names=["Zone 1_new", "Zone 2", "Zone 3", "Zone 4"],
        layer_names=["Layer 1", "Layer 2_new", "Layer 3", "Layer 4"],
        facades=["NAMO", "NAMO", "MED_new", "MED"],
        ref_regs=["arrêté 1", "arrêté 2", "arrêté 3", "arrêté 4_new"],
        urls=["https://dummy_url_1", "https://dummy_url_2", "https://dummy_url_3", "https://dummy_url_4"],
        row_hashes=["cacem_row_hash_1", "cacem_row_hash_2", "cacem_row_hash_3", "cacem_row_hash_4"],
        editions=["2021-10-14", "2021-10-14", "2021-10-14", "2021-10-14"],
        editeurs=["Claire Dagan", "Maxime Perrault", "Vincent Chery", "Mike Data"],
        sources=["Source 1", "Source 2", "Source 3", "Source 4"],
        observations=["Obs1", "Obs2", "Obs3", "Obs4"],
        thematiques=["Mouillage", "Dragage", "Mouillage", "Extraction"],
        dates=["2021-09-04", "2021-09-04", "2021-09-04", "2021-09-04"],
        duree_validites=["permanent", "permanent", "permanent", None],
        temporalites=["permanent", "permanent", "permanent", "temporaire"],
        types=["Arrêté préfectoral", "Décret", "Arrêté inter-préfectoral", None]
    )

@pytest.fixture
def old_regulatory_areas() -> pd.DataFrame:
    return generate_regulatory_area_data(
        ids=[1, 2, 3, 4],
        geom=[
            None,
            None,
            None,
            None,
        ],
        entity_names=["Zone 5", "Zone 6", "Zone 7", "Zone 8"],
        layer_names=["Layer 5", "Layer 6", "Layer 7", "Layer 8"],
        facades=["IDF", "IDF", "NORD", "NORD"],
        ref_regs=["arrêté 5", "arrêté 6", "arrêté 7", "arrêté 8"],
        urls=["https://dummy_url_5", "https://dummy_url_6", "https://dummy_url_7", "https://dummy_url_8"],
        row_hashes=["cacem_row_hash_5", "cacem_row_hash_6", "cacem_row_hash_7", "cacem_row_hash_8"],
        editions=["2021-10-15", "2021-10-16", "2021-10-17", "2021-10-18"],
        editeurs=["Claire Dagan", "Maxime Perrault", "Vincent Chery", "Mike Data"],
        sources=["Source 5", "Source 6", "Source 7", "Source 8"],
        observations=["Obs5", "Obs6", "Obs7", "Obs8"],
        thematiques=["Mouillage", "Dragage", "Mouillage", "Extraction"],
        dates=["2021-09-05", "2021-09-06", "2021-09-07", "2021-09-08"],
        duree_validites=["permanent", "permanent", "permanent", None],
        temporalites=["permanent", "permanent", "permanent", "temporaire"],
        types=["Arrêté préfectoral", "Décret", "Arrêté inter-préfectoral", None]
    )

@pytest.fixture
def themes_regulatory_areas() -> pd.DataFrame:
    return generate_themes_regulatory_area_data(
        themes_id=[1, 1, 2, 2],
        regulatory_areas_id=[1, 2, 3, 4]
    )

@pytest.fixture
def tags_regulatory_areas() -> pd.DataFrame:
    return generate_tags_regulatory_area_data(
        tags_id=[1, 1, 2, 2],
        regulatory_areas_id=[1, 2, 3, 4]
    )

def test_load_new_regulations(reset_test_data, old_regulatory_areas: pd.DataFrame):
    load_new_regulations.run(old_regulatory_areas)
    loaded_regulations = read_query(
        "monitorenv_remote", 
        """SELECT 
            id, geom, entity_name, layer_name, facade,
            ref_reg, url, row_hash, edition, editeur,
            source, observation, thematique, date, 
            duree_validite, temporalite, type
            FROM public.regulations_cacem
            ORDER BY id"""
    )
    pd.testing.assert_frame_equal(loaded_regulations, old_regulatory_areas)


def test_update_new_regulations(reset_test_data, new_regulatory_areas: pd.DataFrame, old_regulatory_areas: pd.DataFrame):
    load(
        old_regulatory_areas,
        table_name="regulations_cacem",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="append",
    )
    update_regulations.run(new_regulatory_areas)
    updated_regulations = read_query(
        "monitorenv_remote", 
        """SELECT 
            id, geom, entity_name, layer_name, facade,
            ref_reg, url, row_hash, edition, editeur,
            source, observation, thematique, date, 
            duree_validite, temporalite, type
            FROM public.regulations_cacem
            ORDER BY id"""
    )
    pd.testing.assert_frame_equal(updated_regulations, new_regulatory_areas)


def test_load_themes_regulatory_areas(reset_test_data, create_cacem_tables,new_regulatory_areas: pd.DataFrame, new_themes: pd.DataFrame,themes_regulatory_areas: pd.DataFrame):
  load_new_regulations.run(new_regulatory_areas)
  load_new_themes.run(new_themes)
  load_themes_regulatory_areas.run(themes_regulatory_areas)
  imported_themes_regulatory_areas = read_query(
        "monitorenv_remote", 
        """SELECT themes_id, regulatory_areas_id
            FROM themes_regulatory_areas
            ORDER BY themes_id"""
    )
  
  pd.testing.assert_frame_equal(themes_regulatory_areas, imported_themes_regulatory_areas)


def test_load_tags_regulatory_areas(reset_test_data, create_cacem_tables,new_regulatory_areas: pd.DataFrame, new_tags: pd.DataFrame, tags_regulatory_areas: pd.DataFrame):
  load_new_regulations.run(new_regulatory_areas)
  load_new_tags.run(new_tags)
  load_tags_regulatory_areas.run(tags_regulatory_areas)
  imported_tags_regulatory_areas = read_query(
        "monitorenv_remote", 
        """SELECT tags_id, regulatory_areas_id
            FROM tags_regulatory_areas
            ORDER BY tags_id"""
    )
  
  pd.testing.assert_frame_equal(tags_regulatory_areas, imported_tags_regulatory_areas)

def test_flow_regulations(create_cacem_tables, reset_test_data):
    state = flow.run()
    assert state.is_successful()
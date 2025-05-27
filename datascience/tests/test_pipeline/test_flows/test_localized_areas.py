from geopandas.testing import assert_geodataframe_equal
import pandas as pd
import prefect
import pytest
import numpy as np

from src.pipeline.flows.localized_areas import load_new_localized_areas, update_localized_areas
from src.pipeline.generic_tasks import extract, load
from src.read_query import read_query

def pg_array_to_list(val):
    if isinstance(val, str):
        val = val.strip("{}")
        if not val:
            return []
        return [int(v) for v in val.split(",")]
    elif isinstance(val, (set, list, np.ndarray)):
        return sorted(list(val))
    return val

def generate_localized_areas_data(ids, geom, names, group_names, control_units_ids, amps_ids):
    return pd.DataFrame({
        "id": ids,
        "geom": geom,
        "name": names,
        "group_name": group_names,
        "control_unit_ids": control_units_ids,
        "amp_ids": amps_ids
    })

@pytest.fixture
def new_localized_areas() -> pd.DataFrame:
    return generate_localized_areas_data(
        ids=[1, 2, 3, 4],
        geom=[None, None, None, None],
        names=["Secteur localisé 1", "Secteur localisé 2", "Secteur localisé 3", "Secteur localisé 4"],
        group_names=["Groupe 1", "Groupe 1", "Groupe 1", "Groupe 2"],
        control_units_ids=[[1], [1, 2], [2, 3], [4]],
        amps_ids=[[1], [1, 2], [3], [4, 3]],
    )

@pytest.fixture
def old_localized_areas() -> pd.DataFrame:
    return generate_localized_areas_data(
        ids=[1, 2, 3, 4],
        geom=[None, None, None, None],
        names=["Secteur localisé 1 old", "Secteur localisé 2", "Secteur localisé 3", "Secteur localisé 4"],
        group_names=["Groupe 1", "Groupe 1", "Groupe 2", "Groupe 2"],
        control_units_ids=[[1], [1, 2], [3], [4]],
        amps_ids=[[1], [1, 2], [3], [3]],
    )


def test_load_new_localized_areas(reset_test_data, old_localized_areas):
    load_new_localized_areas.run(old_localized_areas)

    loaded_localized_areas = read_query(
        "monitorenv_remote", 
        """SELECT 
            id, geom, name, control_unit_ids, amp_ids
            FROM public.localized_areas
            ORDER BY id"""
    )

    pd.testing.assert_frame_equal(loaded_localized_areas, old_localized_areas)


def test_update_localized_areas(reset_test_data, new_localized_areas, old_localized_areas):
    # Charger les anciennes données
    load(
        old_localized_areas,
        table_name="localized_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="append",
        pg_array_columns=["control_unit_ids", "amp_ids"],
    )

    # Appliquer la mise à jour
    update_localized_areas.run(new_localized_areas)

    # Lire les données après mise à jour
    updated_localized_areas = read_query(
        "monitorenv_remote", 
        """
        SELECT id, geom, name, group_name, control_unit_ids, amp_ids
        FROM public.localized_areas
        ORDER BY id
        """
    )

    for col in ["control_unit_ids", "amp_ids"]:
        new_localized_areas[col] = new_localized_areas[col].apply(pg_array_to_list).apply(sorted)
        updated_localized_areas[col] = updated_localized_areas[col].apply(pg_array_to_list).apply(sorted)

    # Comparaison
    pd.testing.assert_frame_equal(updated_localized_areas, new_localized_areas)

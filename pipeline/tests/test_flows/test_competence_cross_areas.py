from geopandas.testing import assert_geodataframe_equal

from src.flows.competence_cross_areas import (
    competence_cross_areas_flow,
    extract_competence_cross_areas,
    load_competence_cross_areas,
)
from src.read_query import read_query


def test_load_competence_cross_areas(create_cacem_tables):
    competence_cross_areas = extract_competence_cross_areas()
    assert competence_cross_areas.shape[0] == 1

    load_competence_cross_areas(competence_cross_areas)
    imported_competence_cross_areas = read_query(
        db="monitorenv_remote",
        query='SELECT id, geom, name, description, "timestamp", "begin", "end", altitude_mode, tessellate, extrude, visibility, draw_order, icon FROM competence_cross_areas',
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )

    assert_geodataframe_equal(
        competence_cross_areas, imported_competence_cross_areas
    )


def test_flow_competence_cross_areas(create_cacem_tables):
    state = competence_cross_areas_flow(return_state=True)
    assert state.is_completed()

from geopandas.testing import assert_geodataframe_equal

from src.pipeline.flows.competence_cross_areas import extract_competence_cross_areas, load_competence_cross_areas, flow
from src.read_query import read_query


def test_load_competence_cross_areas(create_cacem_tables):
    competence_cross_areas = extract_competence_cross_areas.run()
    assert competence_cross_areas.shape[0] == 1

    load_competence_cross_areas.run(competence_cross_areas)
    imported_competence_cross_areas = read_query(
        db="monitorenv_remote",
        query="SELECT * FROM competence_cross_areas",
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )

    assert_geodataframe_equal(competence_cross_areas, imported_competence_cross_areas)

def test_flow_competence_cross_areas(create_cacem_tables):
    state = flow.run()
    assert state.is_successful()

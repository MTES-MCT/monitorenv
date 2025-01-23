from geopandas.testing import assert_geodataframe_equal

from src.pipeline.flows.three_hundred_meters_areas import extract_three_hundred_meters_areas, load_three_hundred_meters_areas, flow
from src.read_query import read_query


def test_load_three_hundred_meters_areas(create_cacem_tables):
    three_hundred_meters_areas = extract_three_hundred_meters_areas.run()
    assert three_hundred_meters_areas.shape[0] == 1

    load_three_hundred_meters_areas.run(three_hundred_meters_areas)
    imported_three_hundred_meters_areas = read_query(
        db="monitorenv_remote",
        query="SELECT id, geom, secteur FROM three_hundred_meters_areas",
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )

    assert_geodataframe_equal(three_hundred_meters_areas, imported_three_hundred_meters_areas)

def test_flow_three_hundred_meters_areas(create_cacem_tables):
    state = flow.run()
    assert state.is_successful()

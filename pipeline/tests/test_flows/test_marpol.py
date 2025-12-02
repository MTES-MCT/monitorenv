from geopandas.testing import assert_geodataframe_equal

from src.flows.marpol import extract_marpol, load_marpol
from src.read_query import read_query


def test_load_marpol(create_cacem_tables):
    marpol = extract_marpol()
    assert marpol.shape[0] == 1

    load_marpol(marpol)
    imported_marpol = read_query(
        db="monitorenv_remote",
        query="SELECT * FROM marpol",
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )

    assert_geodataframe_equal(marpol, imported_marpol)

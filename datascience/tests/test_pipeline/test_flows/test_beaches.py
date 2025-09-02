from geopandas.testing import assert_geodataframe_equal

from src.pipeline.flows.beaches import extract_beaches, load_beaches
from src.read_query import read_query

def test_load_localized_areas(create_cacem_tables):
  beaches = extract_beaches.run()
  assert beaches.shape[0] == 1

  load_beaches.run(beaches)
  imported_beaches = read_query(
      db="monitorenv_remote",
      query="SELECT id, name, insee, official_name, geom, postcode FROM beaches",
      backend="geopandas",
      geom_col="geom",
      crs=4326,
  )

  assert_geodataframe_equal(beaches, imported_beaches) 

from geopandas.testing import assert_geodataframe_equal

from src.pipeline.flows.localized_areas import extract_marine_cultures, load_marine_cultures
from src.read_query import read_query

def test_load_marine_cultures(create_cacem_tables):
  marine_cultures = extract_marine_cultures.run()
  assert marine_cultures.shape[0] == 1

  load_marine_cultures.run(marine_cultures)
  imported_marine_cultures = read_query(
      db="monitorenv_remote",
      query="SELECT * FROM marine_cultures",
      backend="geopandas",
      geom_col="geom",
      crs=4326,
  )

  assert_geodataframe_equal(marine_cultures, imported_marine_cultures) 


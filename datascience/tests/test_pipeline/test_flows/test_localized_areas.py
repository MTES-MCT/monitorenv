
from geopandas.testing import assert_geodataframe_equal

from src.pipeline.flows.localized_areas import extract_marine_cultures_85, load_marine_cultures_85
from src.read_query import read_query

def test_load_marine_cultures_85(create_cacem_tables):
  marine_cultures_85 = extract_marine_cultures_85.run()
  assert marine_cultures_85.shape[0] == 1

  load_marine_cultures_85.run(marine_cultures_85)
  imported_marine_cultures_85 = read_query(
      db="monitorenv_remote",
      query="SELECT * FROM marine_cultures_85",
      backend="geopandas",
      geom_col="geom",
      crs=4326,
  )

  assert_geodataframe_equal(marine_cultures_85, imported_marine_cultures_85) 


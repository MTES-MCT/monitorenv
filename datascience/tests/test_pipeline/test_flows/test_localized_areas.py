from geopandas.testing import assert_geodataframe_equal

from src.pipeline.flows.localized_areas import extract_localized_areas, load_localized_areas
from src.read_query import read_query

def test_load_localized_areas(create_cacem_tables):
  localized_areas = extract_localized_areas.run()
  assert localized_areas.shape[0] == 1

  load_localized_areas.run(localized_areas)
  imported_localized_areas = read_query(
      db="monitorenv_remote",
      query="SELECT id, amp_ids, control_unit_ids, group_name, geom, name FROM localized_areas",
      backend="geopandas",
      geom_col="geom",
      crs=4326,
  )

  assert_geodataframe_equal(localized_areas, imported_localized_areas) 
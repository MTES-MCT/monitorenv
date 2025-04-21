
from geopandas.testing import assert_geodataframe_equal

from src.pipeline.flows.localized_areas import extract_marine_cultures_85, load_marine_cultures_85, extract_gulf_of_lion_marine_park, load_gulf_of_lion_marine_park, extract_cerbere_banyuls_national_reserve, load_cerbere_banyuls_national_reserve, extract_moeze_oleron_national_reserve, load_moeze_oleron_national_reserve
from src.pipeline.generic_tasks import extract, load
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

def test_load_gulf_of_lion_marine_park(create_cacem_tables):
  gulf_of_lion_marine_park = extract_gulf_of_lion_marine_park.run()
  assert gulf_of_lion_marine_park.shape[0] == 1

  load_gulf_of_lion_marine_park.run(gulf_of_lion_marine_park)
  imported_gulf_of_lion_marine_park = read_query(
      db="monitorenv_remote",
      query="SELECT * FROM gulf_of_lion_marine_park",
      backend="geopandas",
      geom_col="geom",
      crs=4326,
  )

  assert_geodataframe_equal(gulf_of_lion_marine_park, imported_gulf_of_lion_marine_park) 

""" def test_load_cerbere_banyuls_national_reserve(create_cacem_tables):
  cerbere_banyuls_national_reserve = extract_cerbere_banyuls_national_reserve.run()
  assert cerbere_banyuls_national_reserve.shape[0] == 1

  load_cerbere_banyuls_national_reserve.run(cerbere_banyuls_national_reserve)
  imported_cerbere_banyuls_national_reserve = read_query(
      db="monitorenv_remote",
      query="SELECT * FROM cerbere_banyuls_national_reserve",
      backend="geopandas",
      geom_col="geom",
      crs=4326,
  )

  assert_geodataframe_equal(cerbere_banyuls_national_reserve, imported_cerbere_banyuls_national_reserve) 

def test_load_cerbere_banyuls_national_reserve(create_cacem_tables):
  moeze_oleron_national_reserve = extract_moeze_oleron_national_reserve.run()
  assert moeze_oleron_national_reserve.shape[0] == 1

  load_moeze_oleron_national_reserve.run(moeze_oleron_national_reserve)
  imported_cmoeze_oleron_national_reserve = read_query(
      db="monitorenv_remote",
      query="SELECT * FROM moeze_oleron_national_reserve",
      backend="geopandas",
      geom_col="geom",
      crs=4326,
  )

  assert_geodataframe_equal(moeze_oleron_national_reserve, imported_cmoeze_oleron_national_reserve) 
 """
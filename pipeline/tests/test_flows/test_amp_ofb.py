import geopandas as gpd
import pytest
from geopandas.testing import assert_geodataframe_equal

from src.flows.amp_ofb import (
    AMP_AREAS_COLUMNS,
    load_amp_areas,
    transform_amp_areas,
)
from src.read_query import read_query
from tests.test_shared_tasks.test_geometries import make_square_multipolygon


@pytest.fixture
def amp_areas_from_ofb() -> gpd.GeoDataFrame:
    return gpd.GeoDataFrame(
        {
            "mpa_id": [3.0, 4, 7, 92, 735],
            "mpa_pid": [1.0, 2, 3, 4, 7],
            "gid": [1.0, 2, 3, 4, 7],
            "des_id": [1.0, 2, 3, 4, 7],
            "mpa_status": [
                "designated",
                "designated",
                "proposed",
                "proposed",
                "proposed",
            ],
            "mpa_name": [
                "AMP 1 updated",
                "AMP 2",
                "AMP 3",
                "AMP 4",
                "AMP 7",
            ],
            "mpa_oriname": [
                "Nom AMP 1 updated",
                "Nom AMP 2",
                "Nom AMP 3",
                "Nom AMP 4",
                "Nom AMP 5",
            ],
            "des_desigfr": [
                "Secteur 1 updated",
                "Secteur 2",
                "Zone A",
                "Zone B",
                "Zone C",
            ],
            "des_desigtype": [
                "External regulation updated",
                "some regulation, some other regulation",
                None,
                "Med regulation",
                "Dead link regulation",
            ],
            "mpa_datebegin": [
                "2024-01-01",
                "2001-01-01",
                "2002-01-01",
                "2003-01-01",
                "2004-01-01",
            ],
            "mpa_statusyr": [2024.0, 2001, 2002, 2003, 2004],
            "mpa_wdpaid": [
                106767.0,
                555526886,
                555526887,
                555526888,
                555526889,
            ],
            "mpa_wdpapid": ["WDPA 1", "WDPA 2", "WDPA 3", "WDPA 4", "WDPA 5"],
            "mpa_mnhnid": [
                "FR3600138",
                "FR1100014",
                None,
                "FR11014",
                "FR11330014",
            ],
            "mpa_marine": [1.0, 0, 1, None, 1],
            "mpa_url": ["URL 1", "URL 2", "URL 3", "URL 4", None],
            "mpa_calcarea": [100.1, 200, 300, 400, 500],
            "mpa_calcmarea": [100.1, 200, 300, 400, 500],
            "mpa_reparea": [100.1, 200, 300, 400, 500],
            "mpa_repmarea": [100.1, 200, 300, 400, 500],
            "mpa_updatewhen": [
                "2024-01-01",
                "2001-01-01",
                "2002-01-01",
                "2003-01-01",
                "2004-01-01",
            ],
            "iucn_idiucn": [
                "IUCN 1 updaed",
                "IUCN 2",
                "IUCN 3",
                "IUCN 4",
                "IUCN 5",
            ],
            "subloc_code": [
                "Subloc 1 updated",
                "Subloc 2",
                "Subloc 3",
                "Subloc 4",
                "Subloc 5",
            ],
            "subloc_name": [
                "Subloc 1 updated",
                "Subloc 2",
                "Subloc 3",
                "Subloc 4",
                "Subloc 5",
            ],
            "country_piso3": ["FRA updated", "FRA", "FRA", "FRA", "FRA"],
            "country_iso3": ["FRA updated", "FRA", "FRA", "FRA", "FRA"],
            "country_iso3namefr": [
                "France updated",
                "France",
                "France",
                "France",
                "France",
            ],
            "geom": [
                make_square_multipolygon(0, 0, 10, 10),
                make_square_multipolygon(120, -20, 15, 10),
                make_square_multipolygon(-60, 10, 5, 10),
                make_square_multipolygon(-10, 45, 180, 5),
                make_square_multipolygon(-110, 60, 10, 10),
            ],
        },
        crs="EPSG:4326",
        geometry="geom",
    )


@pytest.fixture
def amp_areas_after_upsert() -> gpd.GeoDataFrame:
    return gpd.GeoDataFrame(
        {
            "mpa_id": [3, 4, 7, 92, 735],
            "mpa_pid": [1, 2, 3, 4, 7],
            "gid": [1, 2, 3, 4, 7],
            "des_id": [1, 2, 3, 4, 7],
            "mpa_status": [
                "designated",
                "designated",
                "proposed",
                "proposed",
                "proposed",
            ],
            "mpa_name": [
                "AMP 1 updated",
                "AMP 2",
                "AMP 3",
                "AMP 4",
                "AMP 7",
            ],
            "mpa_oriname": [
                "Nom AMP 1 updated",
                "Nom AMP 2",
                "Nom AMP 3",
                "Nom AMP 4",
                "Nom AMP 5",
            ],
            "des_desigfr": [
                "Secteur 1 updated",
                "Secteur 2",
                "Zone A",
                "Zone B",
                "Zone C",
            ],
            "des_desigtype": [
                "External regulation updated",
                "some regulation, some other regulation",
                None,
                "Med regulation",
                "Dead link regulation",
            ],
            "mpa_datebegin": [
                "2024-01-01",
                "2001-01-01",
                "2002-01-01",
                "2003-01-01",
                "2004-01-01",
            ],
            "mpa_statusyr": [2024, 2001, 2002, 2003, 2004],
            "mpa_wdpaid": [106767, 555526886, 555526887, 555526888, 555526889],
            "mpa_wdpapid": ["WDPA 1", "WDPA 2", "WDPA 3", "WDPA 4", "WDPA 5"],
            "mpa_mnhnid": [
                "FR3600138",
                "FR1100014",
                None,
                "FR11014",
                "FR11330014",
            ],
            "mpa_marine": [1, 0, 1, None, 1],
            "mpa_url": ["URL 1", "URL 2", "URL 3", "URL 4", None],
            "mpa_calcarea": [100.1, 200, 300, 400, 500],
            "mpa_calcmarea": [100.1, 200, 300, 400, 500],
            "mpa_reparea": [100.1, 200, 300, 400, 500],
            "mpa_repmarea": [100.1, 200, 300, 400, 500],
            "mpa_updatewhen": [
                "2024-01-01",
                "2001-01-01",
                "2002-01-01",
                "2003-01-01",
                "2004-01-01",
            ],
            "iucn_idiucn": [
                "IUCN 1 updaed",
                "IUCN 2",
                "IUCN 3",
                "IUCN 4",
                "IUCN 5",
            ],
            "subloc_code": [
                "Subloc 1 updated",
                "Subloc 2",
                "Subloc 3",
                "Subloc 4",
                "Subloc 5",
            ],
            "subloc_name": [
                "Subloc 1 updated",
                "Subloc 2",
                "Subloc 3",
                "Subloc 4",
                "Subloc 5",
            ],
            "country_piso3": ["FRA updated", "FRA", "FRA", "FRA", "FRA"],
            "country_iso3": ["FRA updated", "FRA", "FRA", "FRA", "FRA"],
            "country_iso3namefr": [
                "France updated",
                "France",
                "France",
                "France",
                "France",
            ],
            "geom": [
                make_square_multipolygon(0, 0, 10, 10),
                make_square_multipolygon(120, -20, 15, 10),
                make_square_multipolygon(-60, 10, 5, 10),
                make_square_multipolygon(-10, 45, 180, 5),
                make_square_multipolygon(-110, 60, 10, 10),
            ],
            "mpa_type": [None, None, None, None, "MPA Type 1"],
            "ref_reg": [None, None, None, None, "Résumé reg"],
            "url_legicem": [None, None, None, None, "url legicem 1"],
        },
        crs="EPSG:4326",
        geometry="geom",
    )


def test_transform_amp_areas(amp_areas_from_ofb):

    downloaded_amps = gpd.read_file("tests/test_data/zip_files/amp_areas.zip")
    transformed_amp = transform_amp_areas(downloaded_amps)

    assert amp_areas_from_ofb.crs == transformed_amp.crs

    columns_to_load = AMP_AREAS_COLUMNS
    assert amp_areas_from_ofb[columns_to_load].columns.equals(
        transformed_amp[columns_to_load].columns
    )


def test_load_amp_areas(
    create_cacem_tables, amp_areas_from_ofb, amp_areas_after_upsert
):
    load_amp_areas(amp_areas_from_ofb)
    loaded_amp = read_query(
        db="monitorenv_remote",
        query="SELECT mpa_id, mpa_pid, gid, des_id, mpa_status, "
        "mpa_name, mpa_oriname, des_desigfr, des_desigtype, "
        "mpa_datebegin, mpa_statusyr, mpa_wdpaid, mpa_wdpapid, "
        "mpa_mnhnid, mpa_marine, mpa_url, mpa_calcarea, "
        "mpa_calcmarea, mpa_reparea, mpa_repmarea, mpa_updatewhen, "
        "iucn_idiucn, subloc_code, subloc_name, country_piso3, "
        "country_iso3, country_iso3namefr, geom, mpa_type, ref_reg, url_legicem "
        'FROM prod."Aires marines protégées" '
        "ORDER BY mpa_id",
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )

    assert_geodataframe_equal(amp_areas_after_upsert, loaded_amp)

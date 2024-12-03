import pandas as pd
import prefect
import pytest

from src.pipeline.flows.amp_cacem import load_new_amps, update_amps
from src.pipeline.generic_tasks import delete_rows, load
from src.read_query import read_query


@pytest.fixture
def old_amp() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "id": [1, 2, 3, 4],
            "geom": [
                "0106000020E610000001000000010300000001000000040000001EA36CE84A6F04C028FCC"
                "F619D7F47407B5A4C4F4F6904C06878344D997F4740906370C20E6A04C050111641647F47"
                "401EA36CE84A6F04C028FCCF619D7F4740",
                "0106000020E61000000100000001030000000100000004000000508B8D44B1B304C014238"
                "1B3F47F4740A374D56D789004C0C0F2BF049B7F474033F02B2558B104C0CCA0D40BEE7E47"
                "40508B8D44B1B304C0142381B3F47F4740",
                "0106000020E61000000100000001030000000100000004000000D2204A8709EBE33F541AC"
                "4E69B024940B8BC1FBE94F2E33F387D124AAF02494021642107D81FE43F387D124AAF0249"
                "40D2204A8709EBE33F541AC4E69B024940",
                "0106000020E61000000100000001030000000100000004000000F57994631533F2BFE2B98"
                "CD5455446407A715E737969F3BFEAD7CEDEB655464036ED5A29A137F4BF97F69352CC3446"
                "40F57994631533F2BFE2B98CD545544640",
            ],
            "mpa_oriname": [
                "Calanques - aire d'adhésion",
                "dunes, forêt et marais d'Olonne",
                "dunes, forêt et marais d'Olonne'",
                "estuaire de la Bidassoa et baie de Fontarabie",
            ],
            "des_desigfr": [
                "Parc national (aire d'adhésion)",
                "Zone de protection spéciale (N2000, DO)",
                "Zone spéciale de conservation (N2000, DHFF)",
                "Zone de protection spéciale (N2000, DO)",
            ],
            "mpa_type": [
                "Parc national",
                "Natura 2000",
                "Parc naturel marin",
                "Réserve naturelle"
            ],
            "ref_reg": [
                "arrêté 1",
                "arrêté 2",
                "arrêté 3",
                "arrêté 4",
            ],
            "url_legicem": [
                "http://dummy_url_1",
                "http://dummy_url_2",
                "http://dummy_url_3",
                "http://dummy_url_4",
            ],
            "row_hash": [
                "cacem_row_hash_1",
                "cacem_row_hash_2",
                "cacem_row_hash_3",
                "cacem_row_hash_4_new",
            ],
        }
    )

@pytest.fixture
def new_amp() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "id": [1, 2, 3, 4],
            "geom": [
                "0106000020E610000001000000010300000001000000040000001EA36CE84A6F04C028FCC"
                "F619D7F47407B5A4C4F4F6904C06878344D997F4740906370C20E6A04C050111641647F47"
                "401EA36CE84A6F04C028FCCF619D7F4740",
                "0106000020E61000000100000001030000000100000004000000508B8D44B1B304C014238"
                "1B3F47F4740A374D56D789004C0C0F2BF049B7F474033F02B2558B104C0CCA0D40BEE7E47"
                "40508B8D44B1B304C0142381B3F47F4740",
                "0106000020E61000000100000001030000000100000004000000D2204A8709EBE33F541AC"
                "4E69B024940B8BC1FBE94F2E33F387D124AAF02494021642107D81FE43F387D124AAF0249"
                "40D2204A8709EBE33F541AC4E69B024940",
                "0106000020E61000000100000001030000000100000004000000F57994631533F2BFE2B98"
                "CD5455446407A715E737969F3BFEAD7CEDEB655464036ED5A29A137F4BF97F69352CC3446"
                "40F57994631533F2BFE2B98CD545544640",
            ],
            "mpa_oriname": [
                "Calanques - aire d'adhésion",
                "dunes, forêt et marais d'Olonne",
                "dunes, forêt et marais d'Olonne'",
                "estuaire de la Bidassoa et baie de Fontarabie",
            ],
            "des_desigfr": [
                "Parc national (aire d'adhésion)",
                "Zone de protection spéciale (N2000, DO)",
                "Zone spéciale de conservation (N2000, DHFF)",
                "Zone de protection spéciale (N2000, DO)",
            ],
            "mpa_type": [
                "Parc national",
                "Natura 2000",
                "Parc naturel marin",
                "Réserve naturelle"
            ],
            "ref_reg": [
                "arrêté 1",
                "arrêté 2_updated",
                "arrêté 3",
                "arrêté 4",
            ],
            "url_legicem": [
                "https://dummy_url_1",
                "https://dummy_url_2",
                "https://dummy_url_3",
                "https://dummy_url_4",
            ],
            "row_hash": [
                "cacem_row_hash_1",
                "cacem_row_hash_2",
                "cacem_row_hash_3",
                "cacem_row_hash_4_new",
            ],
        }
    )


def test_load_new_amps(reset_test_data, old_amp):
    load_new_amps.run(old_amp)
    loaded_amps = read_query(
        "monitorenv_remote", 
        """SELECT id, geom, 
            mpa_oriname, des_desigfr, 
            mpa_type, ref_reg, 
            url_legicem, row_hash 
            FROM amp_cacem 
            ORDER BY id"""
    )
    pd.testing.assert_frame_equal(loaded_amps, old_amp)


def test_update_new_amps(reset_test_data, new_amp, old_amp):
    load(
        old_amp,
        table_name="amp_cacem",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="append",
    )

    update_amps.run(new_amp)
    updated_amps = read_query(
        "monitorenv_remote", 
        """SELECT id, geom, 
            mpa_oriname, des_desigfr, 
            mpa_type, ref_reg, 
            url_legicem, row_hash 
            FROM amp_cacem 
            ORDER BY id"""
    )
    pd.testing.assert_frame_equal(updated_amps, new_amp)
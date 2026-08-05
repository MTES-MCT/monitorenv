import pandas as pd

from src.db_config import create_engine
from src.read_query import read_query
from src.flows.update_cacem_regulatory_areas import (
    load_new_regulatory_areas_groups,
    update_cacem_regulatory_areas,
    update_cacem_regulatory_areas_flow
)
from sqlalchemy import text


def test_update_cacem_regulatory_areas_flow(
    reset_test_data,
    create_cacem_tables
):
    state = update_cacem_regulatory_areas_flow(return_state=True)

    assert state.is_completed()


def test_load_new_regulatory_areas_groups_uses_upsert_on_id(monkeypatch):
    captured = {}

    def fake_load(df, **kwargs):
        captured["df"] = df
        captured["kwargs"] = kwargs

    monkeypatch.setattr("src.flows.update_cacem_regulatory_areas.load", fake_load)

    new_regulatory_areas_groups = pd.DataFrame({"id": [1]})

    load_new_regulatory_areas_groups(new_regulatory_areas_groups)

    assert captured["kwargs"]["how"] == "upsert"
    assert captured["kwargs"]["table_id_column"] == "id"
    assert captured["kwargs"]["df_id_column"] == "id"
    assert captured["kwargs"]["table_name"] == "reg_cacem"
    assert captured["kwargs"]["schema"] == "prod"
    assert captured["kwargs"]["db_name"] == "cacem_local"



def test_update_cacem_regulatory_areas_replace_tags(reset_test_data):
    id = 1

    e = create_engine("cacem_local")

    with e.begin() as connection:
        connection.execute(
            text("""
        UPDATE prod.reg_cacem
        SET tags = 'A,B,C'
        WHERE id = :id
    """), {"id": 1})

    df = pd.DataFrame(
        {
            "id": [id],
            "url": [None],
            "layer_name": [None],
            "facade": [None],
            "creation": [None],
            "edition_bo": [None],
            "date": [None],
            "date_fin": [None],
            "type": [None],
            "resume": [None],
            "poly_name": [None],
            "plan": [None],
            "authorization_periods": [None],
            "prohibition_periods": [None],
            "additional_ref_reg": [None],
            "location": [None],
            "area_type": [None],
            "themes": [None],
            "tags": ["D,E"],
        }
    )

    update_cacem_regulatory_areas(df)

    result = read_query(
        db="cacem_local",
        query=f"""
        SELECT tags
        FROM prod.reg_cacem
        WHERE id = {id}
        """
    )

    assert result.iloc[0]["tags"] == "D,E"
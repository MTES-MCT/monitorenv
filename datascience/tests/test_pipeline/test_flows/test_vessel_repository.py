from pathlib import Path
import pandas as pd
from src.read_query import read_query

from src.pipeline.flows.vessel_repository import delete_file, parse_xml, get_xsd_schema, load_vessels_batch

from config import (
    TEST_DATA_LOCATION,
)


def test_delete_file(tmp_path):
    tmp_file = tmp_path / "dummy.txt"
    tmp_file.write_text("data")

    assert tmp_file.exists()

    delete_file.run(str(tmp_file))

    assert not tmp_file.exists()


def test_parse_to_df():
    xml_path = TEST_DATA_LOCATION /  "vessel_xml" / "vessel_repository.xml"
    xsd_path = TEST_DATA_LOCATION /  "vessel_xml" / "vessel_repository.xsd"
    schema = get_xsd_schema.run(xsd_path)

    df_batches = list(parse_xml.run(xml_path, schema, batch_size=1))

    assert len(df_batches) == 2

    df1 = df_batches[0]
    assert df1.iloc[0]["ship_id"] == "1111111"
    assert df1.iloc[0]["status"] == "A"
    assert df1.iloc[0]["category"] == "PRO"
    assert df1.iloc[0]["is_banned"] == "No"
    assert df1.iloc[0]["imo_number"] == "1234567"
    assert df1.iloc[0]["mmsi_number"] == "123456789"
    assert df1.iloc[0]["immatriculation"] == "999999"
    assert df1.iloc[0]["ship_name"] == "ShipName1"
    assert df1.iloc[0]["flag"] == "FRA"
    assert df1.iloc[0]["port_of_registry"] == "CHERBOURG"
    assert df1.iloc[0]["category"] == "PRO"
    assert df1.iloc[0]["professional_type"] == "Navire a passagers"
    assert df1.iloc[0]["commercial_name"] == "COMMERCIAL_NAME"
    assert df1.iloc[0]["length"] == "32"
    assert df1.iloc[0]["owner_last_name"] == "NOM 1"
    assert df1.iloc[0]["owner_first_name"] == "PRENOM 1"
    assert df1.iloc[0]["owner_date_of_birth"] == "1977-08-19"
    assert df1.iloc[0]["owner_postal_address"] == "17 AVENUE DESAVENUES 14000 CAEN"
    assert df1.iloc[0]["owner_phone"] == "0987654321"
    assert df1.iloc[0]["owner_email"] == "email1@gmail.com"
    assert df1.iloc[0]["owner_nationality"] == "FRA"
    assert df1.iloc[0]["owner_company_name"] == "COMPANY 1"
    assert df1.iloc[0]["owner_business_segment"] == "93.29Z"
    assert df1.iloc[0]["owner_legal_status"] == "1234"
    assert df1.iloc[0]["owner_start_date"] == "2019-05-29"

    df2 = df_batches[1]
    assert df2.iloc[0]["ship_id"] == "2222222"
    assert df2.iloc[0]["status"] == "A"
    assert df2.iloc[0]["category"] == "PLA"
    assert df2.iloc[0]["is_banned"] == "No"
    assert df2.iloc[0]["imo_number"] == "7654321"
    assert df2.iloc[0]["mmsi_number"] == "987654321"
    assert df2.iloc[0]["immatriculation"] == "888888"
    assert df2.iloc[0]["ship_name"] == "ShipName2"
    assert df2.iloc[0]["flag"] == "FRA"
    assert df2.iloc[0]["port_of_registry"] == "DZAOUDZI"
    assert df2.iloc[0]["length"] == "9.6"
    assert df2.iloc[0]["owner_last_name"] == "NOM 2"
    assert df2.iloc[0]["owner_first_name"] == "PRENOM 2"
    assert df2.iloc[0]["owner_date_of_birth"] == "1977-08-19"
    assert df2.iloc[0]["owner_postal_address"] == "17 RUE DESRUES 14000 CAEN"
    assert df2.iloc[0]["owner_phone"] == "0123456789"
    assert df2.iloc[0]["owner_email"] == "email2@gmail.com"
    assert df2.iloc[0]["owner_nationality"] == "FRA"
    assert df2.iloc[0]["owner_company_name"] == "COMPANY 2"
    assert df2.iloc[0]["owner_business_segment"] == "93.87Z"
    assert df2.iloc[0]["owner_legal_status"] == "5678"
    assert df2.iloc[0]["owner_start_date"] == "2019-05-29"

def test_load(create_cacem_tables, reset_test_data):
    xml_path = TEST_DATA_LOCATION /  "vessel_xml" / "vessel_repository.xml"
    xsd_path = TEST_DATA_LOCATION /  "vessel_xml" / "vessel_repository.xsd"
    schema = get_xsd_schema.run(xsd_path)

    df_batches = list(parse_xml.run(xml_path, schema, batch_size=1))
    df = pd.concat(df_batches, ignore_index=True)
    load_vessels_batch.run(df)

    imported_vessels = read_query(
        "monitorenv_remote",
        # Cast boolean is_banned to Yes / No
        """SELECT ship_id, status, category, CASE WHEN is_banned IS TRUE THEN 'Yes' ELSE 'No' END as is_banned, imo_number, mmsi_number, ship_name, flag, port_of_registry, immatriculation,
        professional_type, commercial_name, length::float as length, owner_last_name, owner_first_name, owner_date_of_birth, owner_postal_address,
        owner_phone, owner_email, owner_nationality, owner_company_name, owner_business_segment, owner_legal_status, owner_start_date 
        FROM vessels"""
    )

    # Cast length to numeric to compare it
    df["length"] = df["length"].apply(pd.to_numeric, errors="coerce")
    imported_vessels["length"] = imported_vessels["length"].apply(pd.to_numeric, errors="coerce")

    pd.testing.assert_frame_equal(df, imported_vessels)
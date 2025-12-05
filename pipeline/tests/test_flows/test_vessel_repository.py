from logging import Logger
from unittest.mock import patch

import pandas as pd

from config import TEST_DATA_LOCATION
from src.flows.vessel_repository import (
    delete_files,
    get_xsd_schema,
    parse_xml_and_load,
    vessel_repository_flow,
)
from src.read_query import read_query
from tests.mocks import (
    mock_delete_files,
    mock_get_xml_files,
    mock_get_xsd_file,
)


def test_delete_file(tmp_path):
    tmp_file = tmp_path / "dummy.txt"
    tmp_file.write_text("data")

    assert tmp_file.exists()

    delete_files([str(tmp_file)])

    assert not tmp_file.exists()


def test_parse_and_load(create_cacem_tables, reset_test_data):
    xml_path = TEST_DATA_LOCATION / "vessel_xml" / "vessel_repository.xml"
    xsd_path = TEST_DATA_LOCATION / "vessel_xml" / "vessel_repository.xsd"
    schema = get_xsd_schema(xsd_path)
    logger = Logger("Test logger")
    parse_xml_and_load(xml_path, logger, schema, batch_size=1)

    expected_df = pd.DataFrame(
        [
            {
                "ship_id": "1111111",
                "status": "A",
                "category": "PRO",
                "is_banned": "No",
                "imo_number": "1234567",
                "mmsi_number": "123456789",
                "call_sign": "0000001",
                "ship_name": "ShipName1",
                "flag": "FRA",
                "port_of_registry": "CHERBOURG",
                "immatriculation": "999999",
                "professional_type": "Porte-Conteneur",
                "leisure_type": None,
                "commercial_name": "UICKSILVER",
                "length": "32",
                "owner_date_of_information": "2019-05-29T00:00:00.000",
                "owner_last_name": "NOM 1",
                "owner_first_name": "PRENOM 1",
                "owner_date_of_birth": "1977-08-19",
                "owner_postal_address": "17 AVENUE DESAVENUES 14000 CAEN",
                "owner_phone": "0987654321",
                "owner_email": "email1@gmail.com",
                "owner_nationality": "FRA",
                "owner_company_name": "COMPANY 1",
                "owner_business_segment": "93.29Z",
                "owner_legal_status": "1234",
                "owner_start_date": "2019-05-29",
                "batch_id": "1",
                "row_number": "1",
            },
            {
                "ship_id": "2222222",
                "status": "A",
                "category": "PLA",
                "is_banned": "No",
                "imo_number": "7654321",
                "mmsi_number": "987654321",
                "call_sign": "0000002",
                "ship_name": "ShipName2",
                "flag": "FRA",
                "port_of_registry": "DZAOUDZI",
                "immatriculation": "888888",
                "professional_type": None,
                "leisure_type": "Navire a passagers",
                "commercial_name": None,
                "length": "9.6",
                "owner_date_of_information": "2019-05-29T00:00:00.000",
                "owner_last_name": "NOM 2",
                "owner_first_name": "PRENOM 2",
                "owner_date_of_birth": "1977-08-19",
                "owner_postal_address": "17 RUE DESRUES 14000 CAEN",
                "owner_phone": "0123456789",
                "owner_email": "email2@gmail.com",
                "owner_nationality": "FRA",
                "owner_company_name": "COMPANY 2",
                "owner_business_segment": "93.87Z",
                "owner_legal_status": "5678",
                "owner_start_date": "2019-05-29",
                "batch_id": "1",
                "row_number": "1",
            },
        ]
    )

    imported_vessels = read_query(
        "monitorenv_remote",
        # Cast boolean is_banned to Yes / No
        """
            SELECT
                ship_id,
                status,
                category,
                CASE
                    WHEN is_banned IS TRUE THEN 'Yes'
                    ELSE 'No'
                END as is_banned,
                imo_number,
                mmsi_number,
                call_sign,
                ship_name,
                flag,
                port_of_registry,
                immatriculation,
                professional_type,
                leisure_type,
                commercial_name,
                length,
                owner_date_of_information,
                owner_last_name,
                owner_first_name,
                owner_date_of_birth,
                owner_postal_address,
                owner_phone,
                owner_email,
                owner_nationality,
                owner_company_name,
                owner_business_segment,
                owner_legal_status,
                owner_start_date,
                batch_id,
                row_number
            FROM vessels
        """,
    )

    # Cast owner_date_of_information to datetime to compare it
    imported_vessels["owner_date_of_information"] = imported_vessels[
        "owner_date_of_information"
    ].apply(pd.to_datetime, errors="coerce")
    expected_df["owner_date_of_information"] = expected_df[
        "owner_date_of_information"
    ].apply(pd.to_datetime, errors="coerce")
    # Cast batch_id, row_number, length and ship_id to numeric to compare it
    expected_df["batch_id"] = expected_df["batch_id"].apply(
        pd.to_numeric, errors="coerce"
    )
    imported_vessels["batch_id"] = imported_vessels["batch_id"].apply(
        pd.to_numeric, errors="coerce"
    )
    expected_df["row_number"] = expected_df["row_number"].apply(
        pd.to_numeric, errors="coerce"
    )
    imported_vessels["row_number"] = imported_vessels["row_number"].apply(
        pd.to_numeric, errors="coerce"
    )
    imported_vessels["ship_id"] = imported_vessels["ship_id"].apply(
        pd.to_numeric, errors="coerce"
    )
    expected_df["ship_id"] = expected_df["ship_id"].apply(
        pd.to_numeric, errors="coerce"
    )
    imported_vessels["ship_id"] = imported_vessels["ship_id"].apply(
        pd.to_numeric, errors="coerce"
    )
    expected_df["length"] = expected_df["length"].apply(
        pd.to_numeric, errors="coerce"
    )
    imported_vessels["length"] = imported_vessels["length"].apply(
        pd.to_numeric, errors="coerce"
    )

    pd.testing.assert_frame_equal(
        expected_df, imported_vessels, check_dtype=False
    )


@patch("src.flows.vessel_repository.get_xsd_file", mock_get_xsd_file)
@patch("src.flows.vessel_repository.get_xml_files", mock_get_xml_files)
@patch("src.flows.vessel_repository.delete_files", mock_delete_files)
def test_flow_vessel_repository(create_cacem_tables, reset_test_data):
    state = vessel_repository_flow(return_state=True)
    assert state.is_completed()

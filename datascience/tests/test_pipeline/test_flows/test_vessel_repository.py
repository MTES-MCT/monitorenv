import tempfile
from pathlib import Path

from src.pipeline.flows.vessel_repository import delete_file, parse_to_gdf
import pandas as pd
from pandas.testing import assert_frame_equal
import xml.etree.ElementTree as ET


def test_delete_file():
    tmp = Path(tempfile.mkstemp()[1])
    assert tmp.exists()

    delete_file.run(str(tmp))

    assert not tmp.exists()

def test_parse_to_df():
    xml_str = """
    <?xml version="1.0" encoding="UTF-8"?>
    <racine>
      <Header>
        <Version>001</Version>
        <LARefId>001</LARefId>
        <SentAt>2025-09-22T16:00:00</SentAt>
        <NumberOfLines>999</NumberOfLines>
      </Header>
      <Body>
        <ShipDescription>
          <ShipId>0000000001</ShipId>
          <Status>A</Status>
          <Category>PRO</Category>
          <IsBanned>No</IsBanned>
        </ShipDescription>
        <Identification>
          <DateOfInformation>2025-09-22T16:00:00</DateOfInformation>
          <IMONumber>9876543</IMONumber>
          <MMSINumber>987654321</MMSINumber>
          <CallSign>+33</CallSign>
          <ShipName>Test</ShipName>
          <VisualIdentification>MONITOR</VisualIdentification>
          <Flag>FRA</Flag>
          <PortOfRegistry>ETEL</PortOfRegistry>
          <Immatriculation>0123456789</Immatriculation>
          <DateImmat>0123456789</DateImmat>  
        </Identification>
        <FrenchRegistry>
          <Francisation>0123456789</Francisation>
          <DateFrancisation>2025-09-22</DateFrancisation>
        </FrenchRegistry>
        <Characteristics>
          <DateOfInformation>2025-09-22T16:00:00</DateOfInformation>
          <ProfessionalType>Type de véhicule pro</ProfessionalType>
          <LeisureType>Type de véhicule de plaisance</LeisureType>
          <CommercialName>MONITOR</CommercialName>
          <YearOfBuild>2025</YearOfBuild>
          <UMSGrossTonnage>1.23</UMSGrossTonnage>
          <TonsGrossTonnage>4.56</TonsGrossTonnage>
          <NetTonnage>7.89</NetTonnage>
          <VolumeOfHold>100000</VolumeOfHold>
          <Deadweight>200000</Deadweight>
          <Length>50000.23</Length>
          <LengthBetweenPerpendiculars>0123456789</LengthBetweenPerpendiculars>
          <Breadth>0123456789</Breadth>
          <MaximumDraught>0123456789</MaximumDraught>
          <HullType>0123456789</HullType>
          <HullColor>0123456789</HullColor>
          <PropulsivePower>0123456789</PropulsivePower>
          <MaxCrewNumber>0123456789</MaxCrewNumber>
          <MaxPassagersNumber>0123456789</MaxPassagersNumber>
        </Characteristics>
        <Communication>
          <DateOfInformation>2025-09-22T16:00:00</DateOfInformation>
          <Email>0123456789</Email>
          <VHF>0123456789</VHF>
          <MF>0123456789</MF>
          <HF>0123456789</HF>
        </Communication>
        <SatellitePhone>
          <PhoneNumber>0123456789</PhoneNumber>
          <PhoneOwner>0123456789</PhoneOwner>
        </SatellitePhone>
        <ShipOwner>
          <DateOfInformation>2025-09-22T16:00:00</DateOfInformation>
          <NameOfCompany>0123456789</NameOfCompany>
          <PostalAddress>0123456789</PostalAddress>
          <Phone>0123456789</Phone>
          <Email>0123456789</Email>
        </ShipOwner>
        <ShipOwnerFAL>
          <DateOfInformation>2025-09-22T16:00:00</DateOfInformation>
          <NameOfCompany>0123456789</NameOfCompany>
          <IMOCompanyNumber>0123456789</IMOCompanyNumber>
          <Phone>0123456789</Phone>
          <Email>0123456789</Email>
        </ShipOwnerFAL>
        <CSO>
          <DateOfInformation>2025-09-22T16:00:00</DateOfInformation>
          <Phone>0123456789</Phone>
          <Email>0123456789</Email>
        </CSO>
        <Owner>
          <DateOfInformation>2025-09-22T16:00:00</DateOfInformation>
          <SourceOfInformation>0123456789</SourceOfInformation>
          <Phone>0123456789</Phone>
          <Email>0123456789</Email>
          <Nationality>0123456789</Nationality>
          <CompanyName>0123456789</CompanyName>
          <BusinessSegment>0123456789</BusinessSegment>
          <LegalStatus>0123456789</LegalStatus>
          <StartDate>0123456789</StartDate>
        </Owner>
        <LicenceHolder>
          <DateOfInformation>2025-09-22T16:00:00</DateOfInformation>
          <HomePhone>0123456789</HomePhone>
          <WorkPhone>0323456789</WorkPhone>
          <MobilePhone>0623456789</MobilePhone>
          <Email>licenceHolder@gmail.com</Email>
        </LicenceHolder>
      </Body>
    </racine>
    """
    root = ET.fromstring(xml_str)

    df = parse_to_gdf.run(root)

    expected = {
        # Header
        "header_Version": "001",
        "header_LARefId": "001",
        "header_SentAt": "2025-09-22T16:00:00",
        "header_NumberOfLines": "999",
        # ShipDescription
        "shipDescription_ShipId": "0000000001",
        "shipDescription_Status": "A",
        "shipDescription_Category": "PRO",
        "shipDescription_IsBanned": "No",
        # Identification
        "identification_DateOfInformation": "2025-09-22T16:00:00",
        "identification_IMONumber": "9876543",
        "identification_MMSINumber": "987654321",
        "identification_CallSign": "+33",
        "identification_ShipName": "Test",
        "identification_VisualIdentification": "MONITOR",
        "identification_Flag": "FRA",
        "identification_PortOfRegistry": "ETEL",
        "identification_Immatriculation": "0123456789",
        "identification_DateImmat": "0123456789",
        # FrenchRegistry
        "frenchRegistry_Francisation": "0123456789",
        "frenchRegistry_DateFrancisation": "2025-09-22",
        # Characteristics
        "characteristics_DateOfInformation": "2025-09-22T16:00:00",
        "characteristics_ProfessionalType": "Type de véhicule pro",
        "characteristics_LeisureType": "Type de véhicule de plaisance",
        "characteristics_CommercialName": "MONITOR",
        "characteristics_YearOfBuild": "2025",
        "characteristics_UMSGrossTonnage": "1.23",
        "characteristics_TonsGrossTonnage": "4.56",
        "characteristics_NetTonnage": "7.89",
        "characteristics_VolumeOfHold": "100000",
        "characteristics_Deadweight": "200000",
        "characteristics_Length": "50000.23",
        "characteristics_LengthBetweenPerpendiculars": "0123456789",
        "characteristics_Breadth": "0123456789",
        "characteristics_MaximumDraught": "0123456789",
        "characteristics_HullType": "0123456789",
        "characteristics_HullColor": "0123456789",
        "characteristics_PropulsivePower": "0123456789",
        "characteristics_MaxCrewNumber": "0123456789",
        "characteristics_MaxPassagersNumber": "0123456789",
        # Communication
        "communication_DateOfInformation": "2025-09-22T16:00:00",
        "communication_Email": "communication@gmail.com",
        "communication_VHF": "0123456789",
        "communication_MF": "0123456789",
        "communication_HF": "0123456789",
        # SatellitePhone
        "satellitePhone_PhoneNumber": "0123456789",
        "satellitePhone_PhoneOwner": "0123456789",
        # ShipOwner
        "shipOwner_DateOfInformation": "2025-09-22T16:00:00",
        "shipOwner_NameOfCompany": "0123456789",
        "shipOwner_PostalAddress": "0123456789",
        "shipOwner_Phone": "0123456789",
        "shipOwner_Email": "shipOwner@gmail.com",
        # ShipOwnerFAL
        "shipOwnerFAL_NameOfCompany": "0123456789",
        "shipOwnerFAL_IMOCompanyNumber": "0123456789",
        "shipOwnerFAL_Phone": "0123456789",
        "shipOwnerFAL_Email": "shipownerFAL@gmail.com",
        # CSO
        "cso_DateOfInformation": "2025-09-22T16:00:00",
        "cso_Phone": "0123456789",
        "cso_Email": "cso@gmail.com",
        # Owner
        "owner_DateOfInformation": "2025-09-22T16:00:00",
        "owner_SourceOfInformation": "0123456789",
        "owner_Phone": "0123456789",
        "owner_Email": "owner@gmail.com",
        "owner_Nationality": "0123456789",
        "owner_CompanyName": "0123456789",
        "owner_BusinessSegment": "0123456789",
        "owner_LegalStatus": "0123456789",
        "owner_StartDate": "0123456789",
        # LicenceHolder
        "licenceHolder_DateOfInformation": "2025-09-22T16:00:00",
        "licenceHolder_HomePhone": "0123456789",
        "licenceHolder_WorkPhone": "0323456789",
        "licenceHolder_MobilePhone": "0623456789",
        "licenceHolder_Email": "licenceHolder@gmail.com",
    }

    expected_df = pd.DataFrame([expected])

    # check_like=True ignores column order
    assert_frame_equal(df, expected_df, check_like=True)
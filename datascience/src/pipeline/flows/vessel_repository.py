from copy import deepcopy
from pathlib import Path
from typing import List
from lxml import etree
import pandas as pd
from config import LIBRARY_LOCATION
from prefect import Flow, task, context, case
from src.pipeline.generic_tasks import load
from src.pipeline.helpers.strings import to_snake_case
from src.pipeline.utils import remove_file

TAGS_TO_INCLUDE = {
"ShipId",
"Status",
"Category",
"IsBanned",
"IMONumber",
"MMSINumber",
"Immatriculation",
"ShipName",
"Flag",
"PortOfRegistry",
"ProfessionalType",
"LeisureType",
"CommercialName",
"Length",
"BatchId",
"RowNumber",
}
OWNER_TAGS_TO_INCLUDE = {
"DateOfInformation",
"LastName",
"FirstName",
"DateOfBirth",
"PostalAddress",
"Phone",
"Email",
"CompanyName",
"Nationality",
"BusinessSegment",
"LegalStatus",
"StartDate"
}

@task(checkpoint=False)
def get_xsd_file(directory: str) -> Path: 
    directory = Path(directory)
    if not directory.exists():
        raise FileNotFoundError(f"Le dossier {directory} n'existe pas")

    xsd_files = list(directory.glob("*.xsd"))

    if len(xsd_files) == 0:
        raise FileNotFoundError("Aucun fichier XSD trouvé dans le répertoire")

    xsd_file = xsd_files[0]
    return xsd_file


@task(checkpoint=False)
def get_xml_files(directory: str) -> List[Path]: 
    directory = Path(directory)
    if not directory.exists():
        raise FileNotFoundError(f"Le dossier {directory} n'existe pas")

    xml_files = list(directory.glob("*.xml"))
    logger = context.get("logger")
    logger.info(f"{len(xml_files)} fichiers XML trouvés")
    return xml_files


@task(checkpoint=False)
def get_xsd_schema(xsd_file_path: str):
    xsd_path = Path(xsd_file_path)
    if not xsd_path.exists():
        raise FileNotFoundError(f"Fichier XSD non trouvé : {xsd_file_path}")

    xsd_doc = etree.parse(str(xsd_path))
    schema = etree.XMLSchema(xsd_doc)
    return schema

def parse_xml_and_load(xml_file_path: str, schema=None, batch_size: int = 100000):
    xml_path = Path(xml_file_path)
    if not xml_path.exists():
        raise FileNotFoundError(f"Fichier XML non trouvé : {xml_file_path}")
    logger = context.get("logger")
    header_elem = None  # variable pour stocker le header
    context_iter = etree.iterparse(str(xml_path), events=("end",), tag=("Header","ShipDescription"))

    batch = []
    for event, elem in context_iter:
        # Capture le header la première fois
        if header_elem is None and elem.tag == "Header":
            header_elem = elem
            continue

        fake_root = etree.Element("racine")
        fake_header = header_elem
        fake_body = etree.Element("Body")
        fake_root.append(fake_header)
        fake_root.append(fake_body)
        fake_body.append(elem)
        # Validation du sous-arbre
        if schema is not None and not schema.validate(fake_root):
            log = schema.error_log.last_error
            logger.warning(f"XML invalide ligne {log.line} : {log.message}")
            elem.clear()
            continue

        record = {}

        for child in elem:
            if child.tag in TAGS_TO_INCLUDE:
                record[f"{to_snake_case(child.tag)}"] = child.text

        metadata = elem.find(".//Metadata")
        if metadata is not None:
            for child in metadata:
                if child.tag in TAGS_TO_INCLUDE:
                    record[f"{to_snake_case(child.tag)}"] = child.text

        identification = elem.find(".//Identification")
        if identification is not None:
            for child in identification:
                if child.tag in TAGS_TO_INCLUDE:
                    record[f"{to_snake_case(child.tag)}"] = child.text

            characteristics = identification.find(".//Characteristics")
            if characteristics is not None:
                for child in characteristics:
                    if child.tag in TAGS_TO_INCLUDE:
                        record[f"{to_snake_case(child.tag)}"] = child.text

                owner = characteristics.find(".//Owner")
                if owner is not None:
                    for child in owner:
                        if child.tag in OWNER_TAGS_TO_INCLUDE:
                            record[f"owner_{to_snake_case(child.tag)}"] = child.text

        batch.append(record)

        # --- Envoi d’un batch complet
        if len(batch) >= batch_size:
            load_vessels_batch(pd.DataFrame(batch))
            batch.clear()

        # --- Libération mémoire
        elem.clear()
        while elem.getprevious() is not None:
            del elem.getparent()[0]

    # --- Dernier batch partiel
    if batch:
        load_vessels_batch(pd.DataFrame(batch))
    logger.info(f"File parsed : {xml_file_path}")



def load_vessels_batch(vessels):
    logger = context.get("logger")
    load(
        vessels,
        table_name="vessels",
        schema="public",
        db_name="monitorenv_remote",
        logger=logger,
        how="append",
    )

@task(checkpoint=False)
def parse_all_xml_files(xml_files, xsd_schema, batch_size=100000):
    for xml_file in xml_files:
        logger = context.get("logger")
        logger.info(f"Parsing file {xml_file}")
        parse_xml_and_load(xml_file, xsd_schema, batch_size)
    return True


@task(checkpoint=False)
def delete_files(xml_files: List[Path]):
    for xml_file in xml_files:
        remove_file(xml_file, ignore_errors=False)

with Flow("Vessel repository") as flow:
    xsd_file = get_xsd_file(LIBRARY_LOCATION / f"pipeline/data/")
    xsd_schema = get_xsd_schema(xsd_file)
    xml_files = get_xml_files(LIBRARY_LOCATION / f"pipeline/data/")
    xml_parsed = parse_all_xml_files(xml_files, xsd_schema)
    with case(xml_parsed, True):
        delete_files(xml_files)

flow.file_name = Path(__file__).name
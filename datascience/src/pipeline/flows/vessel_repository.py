from pathlib import Path
from typing import List
from lxml import etree
import pandas as pd
import pdb
from shapely.geometry import Point
from prefect import Flow, task, context
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
"CommercialName",
"Length",
}
OWNER_TAGS_TO_INCLUDE = {
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
def get_xsd_file(directory: str):
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
    return xml_files


@task(checkpoint=False)
def get_xsd_schema(xsd_file_path: str):
    xsd_path = Path(xsd_file_path)
    if not xsd_path.exists():
        raise FileNotFoundError(f"Fichier XSD non trouvé : {xsd_file_path}")

    xsd_doc = etree.parse(str(xsd_path))
    schema = etree.XMLSchema(xsd_doc)
    return schema

@task(checkpoint=False)
def parse_xml(xml_file_path: str, schema=None, batch_size: int = 1000):
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

                # --- Owner
                owner = characteristics.find(".//Owner")
                if owner is not None:
                    for child in owner:
                        if child.tag in OWNER_TAGS_TO_INCLUDE:
                            record[f"owner_{to_snake_case(child.tag)}"] = child.text

        batch.append(record)

        # --- Envoi d’un batch complet
        if len(batch) >= batch_size:
            gdf = pd.DataFrame(batch)
            yield gdf
            batch.clear()

        # --- Libération mémoire
        elem.clear()
        while elem.getprevious() is not None:
            del elem.getparent()[0]

    # --- Dernier batch partiel
    if batch:
        yield pd.DataFrame(batch)


@task(checkpoint=False)
def load_vessels_batch(vessels):
    logger = context.get("logger")
    load(
        vessels,
        table_name="vessels",
        schema="public",
        db_name="monitorenv_remote",
        logger=logger,
        how="upsert",
        df_id_column="ship_id",
        table_id_column="ship_id"
    )

@task(checkpoint=False)
def parse_and_load(xml_file, schema, batch_size=500):
    for gdf_batch in parse_xml.run(xml_file, schema, batch_size):
        load_vessels_batch.run(gdf_batch)

@task(checkpoint=False)
def parse_all_xml_file_and_delete(xml_files, xsd_schema):
    for xml_file in xml_files:
        parse_and_load.run(xml_file, xsd_schema)
        delete_file.run(xml_file)


@task(checkpoint=False)
def delete_file(file_path: str):
        remove_file(file_path)

with Flow("Vessel repository") as flow:
    xsd_file = get_xsd_file("/data/vessel_repository/")
    xsd_schema = get_xsd_schema(xsd_file)
    xml_files = get_xml_files("/data/vessel_repository/")
    parse_all_xml_file_and_delete(xml_files, xsd_schema)
    delete_file(xsd_file)

flow.file_name = Path(__file__).name

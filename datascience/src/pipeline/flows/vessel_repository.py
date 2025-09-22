from pathlib import Path
import xml.etree.ElementTree as ET
import geopandas as gpd
from shapely.geometry import Point
from prefect import Flow, task
from src.pipeline.generic_tasks import load



@task(checkpoint=False)
def read_xml(file_path: str):
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"{file_path} not found")
    tree = ET.parse(path)
    root = tree.getroot()
    return root


@task(checkpoint=False)
def parse_to_gdf(xml):
    records = []
    for loc in xml.findall("location"):
        name = loc.find("name").text
        lat = float(loc.find("lat").text)
        lon = float(loc.find("lon").text)
        records.append({"name": name, "geometry": Point(lon, lat)})

    gdf = gpd.GeoDataFrame(records, geometry="geometry", crs="EPSG:4326")
    return gdf


@task(checkpoint=False)
def load_vessels(vessels):
    load(
        vessels,
        table_name="vessels",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="upsert",
    )


@task(checkpoint=False)
def delete_file(file_path: str):
    Path(file_path).unlink(missing_ok=True)


with Flow("Vessel repository") as flow:
    xml_root = read_xml("fichier.xml")
    gdf = parse_to_gdf(xml_root)
    load_vessels(gdf)
    delete_file("fichier.xml")


flow.file_name = Path(__file__).name
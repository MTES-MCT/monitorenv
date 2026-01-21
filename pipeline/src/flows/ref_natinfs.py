from pathlib import Path
import pandas as pd
from prefect import flow, get_run_logger, task

from config import LIBRARY_LOCATION
from src.generic_tasks import load



@task
def get_csv_file(directory: str) -> Path:
    directory = Path(directory)
    if not directory.exists():
        raise FileNotFoundError(f"Le dossier {directory} n'existe pas")

    csv_files = list(directory.glob("ref_natinfs.csv"))

    if len(csv_files) == 0:
        raise FileNotFoundError("Le fichier ref_natinfs.csv est introuvable")

    csv_file = csv_files[0]
    return csv_file

@task
def extract_ref_natinfs(filePath):
    return pd.read_csv(
        filePath,
        keep_default_na=False,
        na_values=[""],
        sep=";",
        encoding="latin1"
    )


@task
def load_ref_natinfs(ref_natinfs: pd.DataFrame):
    ref_natinfs = ref_natinfs.rename(columns = 
        {"Numéro NATINF": "id",
        "Nature de l'infraction": "nature", 
        "Qualification de l'infraction": "qualification", 
        "Définie par":"defined_by", 
        "Réprimée par": "repressed_by"})
    
    load(
        ref_natinfs,
        table_name="ref_natinfs",
        schema="public",
        db_name="monitorenv_remote",
        how="replace",
        logger=get_run_logger(),
    )


@flow(name="MonitorEnv - Ref Natinfs")
def ref_natinfs_flow():
    csv_filepath = get_csv_file(LIBRARY_LOCATION / "data/")
    ref_natinfs = extract_ref_natinfs(csv_filepath)
    load_ref_natinfs(ref_natinfs)

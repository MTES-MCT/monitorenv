from pathlib import Path

import pandas as pd
from config import LIBRARY_LOCATION
from prefect import flow, get_run_logger, task

from src.generic_tasks import extract, load


@task
def get_csv_file(directory: str) -> Path:
    directory = Path(directory)
    if not directory.exists():
        raise FileNotFoundError(f"Le dossier {directory} n'existe pas")

    csv_files = list(directory.glob("themes_natinfs.csv"))

    if len(csv_files) == 0:
        raise FileNotFoundError("Le fichier themes_natinfs.csv est introuvable")

    csv_file = csv_files[0]
    return csv_file


@task
def extract_themes() -> pd.DataFrame:
    """Extract themes id, name and parent_id from monitorenv."""
    return extract(
        db_name="monitorenv_remote",
        query_filepath="monitorenv/themes.sql",
    )


@task
def extract_natinf() -> pd.DataFrame:
    """Extract natinfs from monitorenv."""
    return extract(
        db_name="monitorenv_remote",
        query_filepath="monitorenv/natinfs.sql",
    )

@task
def read_csv(path: Path) -> pd.DataFrame:
    """
    Extract each theme - subtheme - natinf_code from the csv file.

    Returns:
        pd.DataFrame: theme, subthemes, natinf_code
    """
    df = pd.read_csv(
        path,
        dtype=str,
        sep=";",
        usecols=["theme_niveau_1", "theme_niveau_2", "Natinf"],
    )
    df.columns = [c.strip().lower() for c in df.columns]
    df = df.rename(
        columns={
            "theme_niveau_1": "theme",
            "theme_niveau_2": "subtheme",
            "natinf": "natinf_code",
        }
    )
    df["natinf_code"] = df["natinf_code"].str.split(",")
    df = df.explode("natinf_code")
    df["natinf_code"] = df["natinf_code"].str.strip().replace("", None).astype("Int64")
    
    return df.drop_duplicates()


@task
def associate_themes_natinfs(
    csv_data: pd.DataFrame,
    themes: pd.DataFrame,
    natinfs: pd.DataFrame,
) -> pd.DataFrame:
    """ Map from csv datas to themes_natinfs."""
    logger = get_run_logger()

    # Join csv subthemes
    df = csv_data.merge(themes, on=["theme", "subtheme"])

    # Join csv natinfs
    df = df.merge(natinfs, on="natinf_code")

    df = df.rename(columns={"subtheme_id": "themes_id"})

    themes_natinfs = (
        df[["themes_id", "natinf_code"]]
        .dropna()
        .astype(int)
        .drop_duplicates()
        .reset_index(drop=True)
    )

    logger.info(f"Found {len(themes_natinfs)} themes_natinfs")
    return themes_natinfs


@task
def load_themes_natinfs(themes_natinfs: pd.DataFrame) -> None:
    load(
        themes_natinfs,
        table_name="themes_natinfs",
        schema="public",
        db_name="monitorenv_remote",
        logger=get_run_logger(),
        how="replace",
    )


@flow(name="Monitorenv - Themes natinfs")
def natinfs_themes_flow():
    csv_file = get_csv_file(LIBRARY_LOCATION / "data/")
    csv_data = read_csv(csv_file)
    if csv_data is not None:
        themes = extract_themes()
        natinfs = extract_natinf()
        themes_natinfs = associate_themes_natinfs(csv_data, themes, natinfs)
        load_themes_natinfs(themes_natinfs)
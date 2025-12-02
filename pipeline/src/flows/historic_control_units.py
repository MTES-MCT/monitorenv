import pandas as pd
from prefect import flow, get_run_logger, task
from sqlalchemy import DDL

from config import HISTORIC_CONTROL_UNITS_MAX_ID
from src.generic_tasks import extract, load


@task
def extract_historic_control_units() -> pd.DataFrame:
    """
    Extract hitoric control units from the fmc database.

    Returns:
        pd.DataFrame: DataFrame historic control units
    """

    return extract(db_name="fmc", query_filepath="fmc/control_units.sql")


@task
def transform_control_units(control_units: pd.DataFrame) -> pd.DataFrame:
    """
    Adds ' (historique)' suffix to control_unit names to avoid conflicts with similarly
    named control units in the new control units reposity, and a 'deleted' field with
    `True` as values.

    Args:
        control_units (pd.DataFrame): Historic control units.

    Returns:
        pd.DataFrame: Modified `control_units` DataFrame
    """
    control_units = control_units.copy(deep=True)

    # Add " [x]" suffix to duplicated control unit names.
    control_units["name_occurence"] = (
        control_units.groupby("name")["id"].rank().astype(int)
    )
    control_units["name_suffix"] = control_units["name_occurence"].map(
        lambda s: f" [{s}]" if s > 1 else ""
    )
    control_units["name"] = control_units[["name", "name_suffix"]].apply(
        lambda row: row["name"] + row["name_suffix"], axis=1
    )
    control_units = control_units.drop(
        columns=["name_occurence", "name_suffix"]
    )

    # Add " (historique)" suffix to control units imported from Poseidon.
    control_units["name"] = control_units.name.map(
        lambda s: s + " (historique)"
    )
    control_units["archived"] = True
    return control_units


@task
def check_id_range(control_units: pd.DataFrame, max_id: int) -> pd.DataFrame:
    """
    Raises `ValueError` if one or more of the `id`s in the input `control_units`
    DataFrame exceed `max_id`. Otherwise returns `control_units`.

    This is done to check that the ids of the historic control units imported do not
    overlap with the ids of the new control units.

    Args:
        control_units (pd.DataFrame): Historic control units, with an `id` column
        max_id (int): Max id reserved for historic control units in the database.

    Raises:
        ValueError: If max(control_units.id) exceeds `max_id`

    Returns:
        pd.DataFrame: Same as input `control_units`
    """
    try:
        assert control_units.id.max() <= max_id
    except AssertionError:
        raise ValueError(
            (
                "Control units ids exceed the maximum allowed for historic control "
                f"units. The id should be less than {max_id} but the ids in the data "
                f"reach {control_units.id.max()}"
            )
        )

    return control_units


@task
def load_historic_control_units(control_units: pd.DataFrame):

    logger = get_run_logger()

    load(
        control_units,
        table_name="control_units",
        schema="public",
        db_name="monitorenv_remote",
        logger=logger,
        how="upsert",
        df_id_column="id",
        table_id_column="id",
        init_ddls=[
            DDL(
                "ALTER TABLE public.missions_control_units "
                "DROP CONSTRAINT missions_control_units_control_unit_id_fkey;"
            )
        ],
        end_ddls=[
            DDL(
                "ALTER TABLE public.missions_control_units "
                "ADD CONSTRAINT missions_control_units_control_unit_id_fkey "
                "FOREIGN KEY (control_unit_id) REFERENCES public.control_units (id);"
            )
        ],
    )


@flow(name="Historic control units")
def historic_control_units_flow(max_id: int = HISTORIC_CONTROL_UNITS_MAX_ID):
    control_units = extract_historic_control_units()
    control_units = transform_control_units(control_units)
    control_units = check_id_range(control_units, max_id=max_id)
    load_historic_control_units(control_units)


import geopandas as gpd
import pandas as pd
from prefect import flow, get_run_logger, task

from src.generic_tasks import extract, load


@task
def validate_action(action: str) -> str:
    """
    Checks that the received parameter value is valid and returns it. Raises ValueError
    otherwise.

    Args:
        action (str): input parameter for the flow

    Returns:
        str: input, if valid

    Raises:
        ValueError: if input in not valid
    """

    valid_actions = {"update", "replace"}

    if action in valid_actions:
        return action
    else:
        raise ValueError(
            f"action must be one of {', '.join(valid_actions)}, got {action}"
        )

@task
def join(
    previous_last_positions: pd.DataFrame,
    last_positions: pd.DataFrame,
) -> pd.DataFrame:
    last_positions = (
        pd.concat(
            [
                previous_last_positions,
                last_positions,
            ]
        )
    ).sort_values("ts", ascending=False).groupby("mmsi").head(1)

    return last_positions

@task
def extract_last_positions(minutes: int) -> gpd.GeoDataFrame:
    """
    Extracts the last position of each vessel over the past `minutes` minutes.

    Args:
        minutes (int): number of minutes from current datetime to extract

    Returns:
        gpd.GeoDataFrame: GeoDataFrame of vessels' last position.
    """
    return extract(
        db_name="monitorenv_remote",
        query_filepath="monitorenv/compute_last_positions.sql",
        params={"minutes": minutes},
        geom_col="coord"
    )

@task
def extract_previous_last_positions() -> gpd.GeoDataFrame:
    """
    Extracts the contents of the `last_positions` table (which was computed by the
    previous run of the `last_positions` flow), with the `has_charter` field updated
    by taking the current value in the `vessels` table.

    Returns:
        pd.DataFrame: DataFrame of vessels' last position as (it was last computed by
          the last_positions flow).
    """
    return extract(
        db_name="monitorenv_remote",
        query_filepath="monitorenv/previous_last_positions.sql",
        geom_col="coord"
    )

@task
def load_last_positions(last_positions):
    load(
        last_positions,
        table_name="last_positions",
        schema="public",
        db_name="monitorenv_remote",
        logger=get_run_logger(),
        how="replace",
        nullable_integer_columns=["vessel_id"]
    )


@flow(name="Monitorenv - Last positions")
def last_positions_flow(minutes: int = 5, action: str = "update",):
    action = validate_action(action)
    last_positions = extract_last_positions(minutes=minutes)

    if action == "update":
        previous_last_positions = extract_previous_last_positions.submit()
        last_positions = join(previous_last_positions, last_positions)

    # Load
    load_last_positions(last_positions)

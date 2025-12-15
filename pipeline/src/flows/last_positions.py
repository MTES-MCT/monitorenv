from logging import Logger
import pdb
from typing import Tuple

import geopandas as gpd
import pandas as pd
from prefect import flow, get_run_logger, task
from pyproj import Geod
from sqlalchemy import bindparam, text

from src.db_config import create_engine
from src.generic_tasks import extract, load
from src.processing import (
    drop_duplicates_by_decreasing_priority,
    join_on_multiple_keys,
    left_isin_right_by_decreasing_priority,
)


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
def extract_latest_vessels(mmsi: list[int]) -> pd.DataFrame:
    """
    Extracts from the latest_vessels materialized view by mmsi

    Returns:
        pd.DataFrame: DataFrame of vessels' last position.
    """
    query = text("""
        SELECT
            ship_id AS vessel_id,
            CASE WHEN mmsi_number IS NOT NULL THEN mmsi_number::integer ELSE NULL END as mmsi
        FROM latest_vessels
        WHERE mmsi_number IN :mmsi
    """).bindparams(
        bindparam("mmsi", expanding=True))
    
    engine = create_engine(db="monitorenv_remote")
    return pd.read_sql(query, engine, params={"mmsi": [str(x) for x in mmsi]})

@task
def drop_duplicates(positions: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Drop duplicate vessels in a `pandas.DataFrame` of positions, keeping only the most
    recent position of each vessel.

    This is required although the query that computes last positions already contains a
    DISTINCT ON clause because for some vessels, we receive each position twice with
    partially different identifiers - for instance, the same CFR but different ircs or
    external immatriculation.

    De-deplucation is done using, by decreasing priority, vessel_id and mmsi

    Args:
        positions (gpd.GeoDataFrame): positions of vessels. Must contain columns "vessel_id", "mmsi", "ts".

    Returns:
        gpd.GeoDataFrame: GeoDataFrame of vessels' last position with duplicates removed.
    """
    return drop_duplicates_by_decreasing_priority(
        positions.sort_values(by="ts", ascending=False),
        subset=["vessel_id", "mmsi"],
    )

@task
def add_vessel_id(last_positions: gpd.GeoDataFrame) -> pd.DataFrame:
    """
    Adds a `vessel_id` column to the input `DataFrame` by:

      - querying all vessels in the `vessels` table that have a matching `mmsi`
      - matching the found vessels to the input vessels using the `merge_vessel_id`
        helper.

    Args:
        last_positions (pd.DataFrame): DataFrame of last_positions. Must have columns `mmsi`

    Returns:
        pd.DataFrame: Same as input with an added `vessel_id` column.
    """
    logger = get_run_logger()

    if "vessel_id" in last_positions:
        logger.warning(
            (
                "Column `vessel_id` already present in input DataFrame, "
                "returning unmodified input."
            )
        )
        return last_positions
    
    found_vessels = extract_latest_vessels(last_positions.mmsi.dropna().drop_duplicates().to_list())

    last_positions_with_vessel_id = merge_vessel_id(last_positions, found_vessels, logger)
    
    return last_positions_with_vessel_id




def merge_vessel_id(
    last_positions: gpd.GeoDataFrame, found_vessels: pd.DataFrame, logger: Logger
) -> gpd.GeoDataFrame:
    """
    The two input DataFrames are assumed to be:

      - a list of last_positions with `mmsi` identifiers
        (plus potential other columns) without a `vessel_id` column
      - a list of vessels with `mmsi` and
        `vessel_id` columns (and no other columns). Typically these are the vessels
        that are found in the `latest_vessels` table that match the identifiers of the
        `vessels`

    The idea is to add the `vessel_id` from the second DataFrame as a new column in the
    first DataFrame, by matching the right lines in both DataFrame.

    This is done by perfoming a left join of the input DataFrames using
    join left on mmsi.

    The result always has exactly the same lines as the first input DataFrame.

    Args:
        last_positions (gpd.GeoDataFrame): Vessels to match to a found_vessel
        found_vessels (pd.DataFrame): found_vessels to match to a vessel
        logger (Logger): Logger instance

    Returns:
        gpd.GeoDataFrame: Same as vessels with an added `vessel_id` column.
    """
    last_positions = last_positions.copy()
    merged = last_positions.merge(found_vessels[['mmsi', 'vessel_id']], how='left', on='mmsi')
    return merged.reset_index(drop=True)


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
def drop_unchanged_new_last_positions(
    new_last_positions: pd.DataFrame, previous_last_positions: pd.DataFrame
) -> pd.DataFrame:
    """
    Filters all positions of new_last_positions that are present in
    previous_last_positions.

    Args:
        previous_last_positions (pd.DataFrame)
        new_last_positions (pd.DataFrame)

    Returns:
        pd.DataFrame: subset of new_last_positions
    """
    return new_last_positions[
        ~new_last_positions.id.isin(set(previous_last_positions.id))
    ].copy(deep=True)


@task
def split(
    previous_last_positions: gpd.GeoDataFrame, new_last_positions: gpd.GeoDataFrame
) -> Tuple[gpd.GeoDataFrame, gpd.GeoDataFrame, gpd.GeoDataFrame]:
    """
    Splits vessels into 3 categories:

    - The ones that are in previous_last_positions only (known vessels that haven't
      moved)
    - The ones that are in new_last_positions only (new vessels never seen before)
    - The ones in both datasets (known vessels that have moved and whose position must
      be updated)

    Returns the last_positions data of these 3 sets of vessels separately in 3
    DataFrames. For vessels whose position must be updated, the returned DataFrame
    contains the data of both the previous and the new last_position, in order to make
    it possible to computed some metrics (i.e. the emission period).

    Args:
        previous_last_positions (gpd.GeoDataFrame)
        new_last_positions (gpd.GeoDataFrame)

    Returns:
        Tuple[gpd.GeoDataFrame, gpd.GeoDataFrame, gpd.GeoDataFrame]:
          - unchanged_previous_last_positions
          - new_vessels_last_positions
          - last_positions_to_update
    """

    previous_last_positions = previous_last_positions.copy(deep=True)
    new_last_positions = new_last_positions.copy(deep=True)

    vessel_id_cols = ["vessel_id", "mmsi"]

    unchanged_previous_last_positions = previous_last_positions[
        ~left_isin_right_by_decreasing_priority(
            previous_last_positions[vessel_id_cols], new_last_positions[vessel_id_cols]
        )
    ]

    new_vessels_last_positions = new_last_positions[
        ~left_isin_right_by_decreasing_priority(
            new_last_positions[vessel_id_cols], previous_last_positions[vessel_id_cols]
        )
    ]

    last_positions_to_update = join_on_multiple_keys(new_last_positions,
        previous_last_positions[vessel_id_cols + ["ts"]],
        or_join_keys=vessel_id_cols,
        how="inner",
        coalesce_common_columns=False,
    )

    return (
        unchanged_previous_last_positions,
        new_vessels_last_positions,
        last_positions_to_update,
    )


@task
def concatenate(
    unchanged_previous_last_positions: gpd.GeoDataFrame,
    new_vessels_last_positions: gpd.GeoDataFrame,
    updated_last_positions: gpd.GeoDataFrame,
) -> gpd.GeoDataFrame:
    """
    Concatenates the 3 sets of last_positions and reindexes the rows from 1 to n.

    Args:
        unchanged_previous_last_positions (pd.DataFrame)
        new_vessels_last_positions (pd.DataFrame)
        updated_last_positions (pd.DataFrame)

    Returns:
        pd.DataFrame: concatenation of the 3 inputs sets of last_positions
    """

    last_positions = (
        pd.concat(
            [
                unchanged_previous_last_positions,
                new_vessels_last_positions,
                updated_last_positions,
            ]
        )
        .reset_index()
        .drop(columns=["index"])
    )

    return last_positions

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
    last_positions = add_vessel_id(last_positions)
    last_positions = drop_duplicates(last_positions)

    if action == "update":
        previous_last_positions = extract_previous_last_positions.submit()
        previous_last_positions = drop_duplicates(previous_last_positions)
        new_last_positions = drop_unchanged_new_last_positions(
            last_positions, previous_last_positions
        )

        (
            unchanged_previous_last_positions,
            new_vessels_last_positions,
            last_positions_to_update,
        ) = split(previous_last_positions, new_last_positions)

        last_positions = concatenate(
            unchanged_previous_last_positions,
            new_vessels_last_positions,
            last_positions_to_update,
        )

    last_positions = drop_duplicates(last_positions)

    # Load
    load_last_positions(last_positions)

from datetime import datetime
from logging import Logger
from typing import Callable, Tuple

import numpy as np
import geopandas as gpd
import pandas as pd
from prefect import flow, get_run_logger, task
from pyproj import Geod
from sqlalchemy import Select, Table, select

from config import CURRENT_POSITION_ESTIMATION_MAX_HOURS, default_risk_factors
from src import read_query
from src.generic_tasks import extract, load
from src.processing import (
    coalesce,
    drop_duplicates_by_decreasing_priority,
    get_unused_col_name,
    join_on_multiple_keys,
    left_isin_right_by_decreasing_priority,
)
from src.utils import get_table


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
        dtypes={"ts": "datetime64[ns]"},
        geom_col="coord"
    )

@task
def extract_latest_vessels(mmsi: list[int]) -> pd.DataFrame:
    """
    Extracts from the latest_vessels materialized view by mmsi

    Returns:
        pd.DataFrame: DataFrame of vessels' last position.
    """
    return extract(
        db_name="monitorenv_remote",
        query_filepath="monitorenv/find_latest_vessels_by_mmsi.sql",
        params={"mmsi": mmsi},
    )

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

    Additionnally, the returned `vessel_id` for each line in the first DataFrame is
    `None` if the following conditions are not met :

      - there is no ambiguity: only one vessel in the second DataFrame can be matched
        to a given line in the first DataFrame
      - there is no conflict: at most one vessel in the first DataFrame can be matched
        to a given line in the second DataFrame

    Lines in the second DataFrame that do not match a line in the first DataFrame are
    absent from the result.

    Lines in the first DataFrame that do not match a line in the second DataFrame are
    present in the result with a `vessel_id` of `None`.

    The result always has exactly the same lines as the first input DataFrame.

    Args:
        last_positions (gpd.GeoDataFrame): Vessels to match to a found_vessel
        found_vessels (pd.DataFrame): found_vessels to match to a vessel
        logger (Logger): Logger instance

    Returns:
        gpd.GeoDataFrame: Same as vessels with an added `vessel_id` column.
    """
    initial_length = len(last_positions)
    last_positions = last_positions.copy(deep=True)

    # Number rows of input DataFrame
    input_id = get_unused_col_name("input_row_number", last_positions)
    last_positions[input_id] = range(len(last_positions))

    # Join
    last_positions = last_positions.merge(found_vessels, how="left", on="mmsi")

    last_positions["is_ambiguous"] = last_positions.duplicated(subset=input_id, keep=False)
    last_positions["is_in_conflict"] = last_positions.duplicated(subset="vessel_id", keep=False)

    if last_positions.is_ambiguous.any():
        ambiguous_last_positions = last_positions.loc[
            last_positions.is_ambiguous,
            [input_id, "mmsi", "vessel_id"],
        ].sort_values(input_id)

        warning_message = (
            "The following identifiers are ambiguous as they could correspond to "
            "more than one vessel:\n" + str(ambiguous_last_positions.to_string(index=False))
        )

        logger.warning(warning_message)

    if last_positions.is_in_conflict.any():
        last_positions_in_conflict = last_positions.loc[
            last_positions.is_in_conflict,
            [input_id, "mmsi", "vessel_id"],
        ].sort_values("vessel_id")

        warning_message = (
            "The following identifiers conflict with one another - "
            "more than one match the same vessel:\n"
            + str(last_positions_in_conflict.to_string(index=False))
        )

        logger.warning(warning_message)

    last_positions = last_positions.drop_duplicates(subset=input_id)

    assert len(last_positions) == initial_length

    last_positions["vessel_id"] = last_positions.vessel_id.where(
        ~(last_positions[["is_ambiguous", "is_in_conflict"]].any(axis=1)), np.nan
    )

    return (
        last_positions.sort_values(input_id)
        .drop(columns=[input_id, "is_ambiguous", "is_in_conflict"])
        .reset_index(drop=True)
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

    last_positions_to_update = join_on_multiple_keys(
        (
            new_last_positions.rename(
                columns={"ts": "ts_new"}
            )
        ),
        (
            previous_last_positions[
                vessel_id_cols + ["ts"]
            ].rename(
                columns={
                    "ts": "ts_previous"
                }
            )
        ),
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
def compute_emission_period(last_positions_to_update: pd.DataFrame) -> pd.DataFrame:
    """
    Computes the emission period of the last_positions that require an update.

    If an emission period is already present (which might happen if there are more
    than one position per vessel in the requested time period of the last_position
    query), this emission period is used. Otherwise, the emission period is taken to
    be equal to the time between the previous last_position_datetime_utc and the new
    last_position_datetime_utc.

    Args:
        last_positions_to_update (pd.DataFrame): last_positions data for vessels that
          have moved

    Returns:
        pd.DataFrame: updated last_positions with computed emission period field

    """

    updated_last_positions = last_positions_to_update.copy(deep=True)

    updated_last_positions["new_to_previous_time_interval"] = (
        updated_last_positions.ts_new
        - updated_last_positions.ts_previous
    )

    updated_last_positions.loc[:, "emission_period"] = coalesce(
        updated_last_positions[["emission_period", "new_to_previous_time_interval"]]
    )

    updated_last_positions = updated_last_positions.drop(
        columns=["new_to_previous_time_interval", "ts_previous"]
    ).rename(columns={"ts_new": "ts"})

    return updated_last_positions


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

def estimate_current_position(
    last_latitude: float,
    last_longitude: float,
    course: float,
    speed: float,
    hours_since_last_position: float,
    max_hours_since_last_position: float = 2.0,
    on_error: str = "ignore",
) -> Tuple[float, float]:
    """
    Estimate the current position of a vessel based on its last position, course and
    speed. If the last position is older than max_hours_since_last_position, or is in
    the future (i.e. hours_since_last_position is negative), returns None.

    Args:
        last_latitude (float): last known latitude of vessel
        last_longitude (float): last known longitude of vessel
        course (float): last known route of vessel in degrees
        speed (float): last known speed of vessel in nots
        hours_since_last_position (float): time since last known position of vessel, in
          hours
        max_hours_since_last_position (float): maximum time in hours since last
          position, after which the estimation is not performed (returns None instead)
          Defaults to 2.0
        on_error (str): 'ignore' or 'raise'

    Returns:
        float: estimated current latitude
        float: estimated current longitude
    """
    if not 0 <= hours_since_last_position <= max_hours_since_last_position:
        lat, lon = None, None
    else:
        geod = Geod(ellps="WGS84")
        try:
            distance = speed * hours_since_last_position * 1852
            lon, lat, _ = geod.fwd(last_longitude, last_latitude, course, distance)
        except:
            if on_error == "ignore":
                lat, lon = None, None
            elif on_error == "raise":
                raise
            else:
                raise ValueError(
                    f"on_error argument must be 'ignore' or 'raise', got {on_error}."
                )
    return lat, lon

@task
def estimate_current_positions(
    last_positions: pd.DataFrame, max_hours_since_last_position: float
) -> pd.DataFrame:
    """

    Args:
        last_positions (pd.DataFrame): vessels' last position with route and speed
          data.
      max_hours_since_last_position (float): maximum time in hours since the last
        position above which the current position will not be extrapolated.

    Returns:
        pd.DataFrame: vessels' last position with added estimated_current_latitude and
          estimated_current_longitude fields

    """

    last_positions = last_positions.copy(deep=True)
    now = datetime.utcnow()

    estimated_position_cols = [
        "estimated_current_latitude",
        "estimated_current_longitude",
    ]

    last_positions[estimated_position_cols] = last_positions.apply(
        lambda row: estimate_current_position(
            last_latitude=row["coord"].y,
            last_longitude=row["coord"].x,
            course=row["course"],
            speed=row["speed"],
            hours_since_last_position=(
                (now - row["ts"]).total_seconds() / 3600
            ),
            max_hours_since_last_position=max_hours_since_last_position,
            on_error="ignore",
        ),
        axis=1,
        result_type="expand",
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
    )


@flow(name="Last positions")
def last_positions_flow(current_position_estimation_max_hours: int = CURRENT_POSITION_ESTIMATION_MAX_HOURS, minutes: int = 5, action: str = "update",):
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
        updated_last_positions = compute_emission_period(last_positions_to_update)

        last_positions = concatenate(
            unchanged_previous_last_positions,
            new_vessels_last_positions,
            updated_last_positions,
        )

    last_positions = estimate_current_positions(
        last_positions=last_positions,
        max_hours_since_last_position=current_position_estimation_max_hours,
    )

    last_positions = drop_duplicates(last_positions)

    # Load
    load_last_positions(last_positions)

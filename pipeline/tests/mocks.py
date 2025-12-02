from datetime import datetime
from io import BytesIO
from pathlib import Path
from typing import List, Union
from unittest.mock import MagicMock, patch

import pandas as pd
import requests
from prefect import task

from config import TEST_DATA_LOCATION
from src.generic_tasks import extract
from src.shared_tasks.datagouv import update_resource


def mock_extract_side_effect(
    db_name: str,
    query_filepath: Union[Path, str],
    dtypes: Union[None, dict] = None,
    parse_dates: Union[list, dict, None] = None,
    params: Union[dict, None] = None,
    backend: str = "pandas",
    geom_col: str = "geom",
    crs: Union[int, None] = None,
):
    @patch("src.read_query.pd")
    @patch("src.read_query.create_engine")
    def mock_extract_side_effect_(
        db_name,
        query_filepath,
        dtypes,
        parse_dates,
        params,
        mock_create_engine,
        mock_pd,
    ):
        def read_sql_mock(query, engine, **kwargs):
            return query

        mock_pd.read_sql.side_effect = read_sql_mock

        return extract(
            db_name=db_name,
            query_filepath=query_filepath,
            dtypes=None,
            parse_dates=parse_dates,
            params=params,
        )

    return mock_extract_side_effect_(
        db_name, query_filepath, dtypes, parse_dates, params
    )


def mock_datetime_utcnow(utcnow: datetime):
    mock_datetime = MagicMock()
    mock_datetime.utcnow = MagicMock(return_value=utcnow)
    return mock_datetime


@task
def mock_update_resource(
    dataset_id: str,
    resource_id: str,
    resource_title: str,
    resource: BytesIO,
    mock_update: bool,
) -> pd.DataFrame:
    def return_200(url, **kwargs):
        r = requests.Response()
        r.status_code = 200
        r.url = url
        return r

    with patch("src.shared_tasks.datagouv.requests.post", return_200):
        return update_resource(
            dataset_id=dataset_id,
            resource_id=resource_id,
            resource_title=resource_title,
            resource=resource,
            mock_update=mock_update,
        )


@task
def mock_get_xml_files(dummy: str):
    return [Path(TEST_DATA_LOCATION / "vessel_xml" / "vessel_repository.xml")]


@task
def mock_get_xsd_file(dummy: str):
    return Path(TEST_DATA_LOCATION / "vessel_xml" / "vessel_repository.xsd")


@task
def mock_delete_files(xml_files: List[Path]) -> None:
    pass

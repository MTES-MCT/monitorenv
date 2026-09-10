from datetime import date
from prefect import flow

from config import QUERIES_LOCATION
from src.shared_tasks.etl import run_sql_script


@flow(
    name="Monitorenv - Update departments and façades for missions and envActions"
)
def update_departments_and_facades_flow(date: date):
    run_sql_script(QUERIES_LOCATION / "monitorenv/update_missions_facades.sql", params={"date": date})
    run_sql_script(
        QUERIES_LOCATION / "monitorenv/update_actions_departments.sql", params={"date": date}
    )
    run_sql_script(QUERIES_LOCATION / "monitorenv/update_actions_facades.sql", params={"date": date})

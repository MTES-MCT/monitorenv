from datetime import date
from typing import Literal
from prefect import flow

from config import QUERIES_LOCATION
from src.shared_tasks.etl import run_sql_script

Domain_objects = Literal["Zones de vigilances", "Zones réglementaires", "Missions et env_actions"]

@flow(
    name="Monitorenv - Update departments and façades for vigilance areas, regulatory_areas or missions and envActions"
)
def update_departments_and_facades_flow(
    domain_object: Domain_objects,
    date: date | None = None,
):
    # --- Validation des paramètres : on échoue avant d'exécuter quoi que ce soit ---
    if domain_object == "Missions et env_actions" and date is None:
        raise ValueError("Le paramètre `date` est obligatoire pour 'Missions et env_actions'.")

    # --- Exécution ---
    if domain_object == "Zones de vigilances":
        run_sql_script(QUERIES_LOCATION / "monitorenv/update_vigilance_areas_facades.sql")

    elif domain_object == "Zones réglementaires":
        run_sql_script(QUERIES_LOCATION / "monitorenv/update_regulatory_areas_facades.sql")

    elif domain_object == "Missions et env_actions":
        run_sql_script(QUERIES_LOCATION / "monitorenv/update_missions_facades.sql", params={"date": date})
        run_sql_script(QUERIES_LOCATION / "monitorenv/update_actions_departments.sql", params={"date": date})
        run_sql_script(QUERIES_LOCATION / "monitorenv/update_actions_facades.sql", params={"date": date})

    else:
        raise ValueError(f"domain_object non supporté : {domain_object}")
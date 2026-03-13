import pandas as pd

from src.generic_tasks import load
from src.flows.update_env_regulatory_areas import (
    update_env_regulatory_areas_flow
)

def test_update_env_regulatory_areas_flow(
    reset_test_data,
    create_cacem_tables,
    create_tables
):
    state = update_env_regulatory_areas_flow(return_state=True)

    assert state.is_completed()
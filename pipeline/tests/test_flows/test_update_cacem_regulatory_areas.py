import pandas as pd

from src.generic_tasks import load
from src.flows.update_cacem_regulatory_areas import (
    update_cacem_regulatory_areas_flow
)

def test_update_cacem_regulatory_areas_flow(
    reset_test_data,
    create_cacem_tables
):
    state = update_cacem_regulatory_areas_flow(return_state=True)

    assert state.is_completed()
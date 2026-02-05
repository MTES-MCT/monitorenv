from logging import Logger

import pandas as pd
import pytest
from src.generic_tasks import load
from src.flows.update_cacem_regulatory_areas import (
    update_cacem_regulatory_areas_flow,
    cacem_rows,
    monitorenv_rows,
)

def test_update_cacem_regulatory_areas_flow(
    reset_test_data,
    create_cacem_tables,
    cacem_regulatory_areas,
    monitorenv_regulatory_areas,
):
    state = update_cacem_regulatory_areas_flow(return_state=True)

    assert state.is_completed()
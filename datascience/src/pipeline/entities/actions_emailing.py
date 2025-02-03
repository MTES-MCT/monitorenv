from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import List

import pandas as pd

from src.pipeline.helpers.dates import Period


class EnvActionType(Enum):
    CONTROL = "CONTROL"
    SURVEILLANCE = "SURVEILLANCE"


@dataclass
class ControlUnit:
    control_unit_id: int
    control_unit_name: str
    email_addresses: List[str]


@dataclass
class ControlUnitActions:
    """
    Control unit and its environment control actions between two dates.
    """

    control_unit: ControlUnit
    period: Period
    controls: pd.DataFrame
    late_controls: pd.DataFrame
    surveillances: pd.DataFrame
    late_surveillances: pd.DataFrame


@dataclass
class ControlUnitActionsSentMessage:
    control_unit_id: int
    control_unit_name: str
    email_address: str
    sending_datetime_utc: datetime
    actions_min_datetime_utc: datetime
    actions_max_datetime_utc: datetime
    number_of_actions: int
    success: bool
    error_code: int
    error_message: str

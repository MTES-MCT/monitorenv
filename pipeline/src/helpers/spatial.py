from dataclasses import dataclass
from typing import Union

from shapely.geometry import MultiPolygon, Polygon


@dataclass
class Position:
    latitude: float
    longitude: float


def to_multipolygon(p: Union[Polygon, MultiPolygon]) -> MultiPolygon:
    """
    Returns a MultiPolygon of the input Polygon or MultiPolygon geometry.
    """

    if isinstance(p, Polygon):
        res = MultiPolygon([p])
    elif isinstance(p, MultiPolygon):
        res = p
    else:
        raise ValueError("Input must be shapely Polygon or MultiPolygon")

    return res

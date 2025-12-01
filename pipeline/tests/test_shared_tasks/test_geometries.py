from shapely.geometry import MultiPolygon


def make_square_multipolygon(
    init_lon,
    init_lat,
    width,
    height,
):
    return MultiPolygon(
        [
            (
                (
                    (init_lon, init_lat),
                    (init_lon + width, init_lat),
                    (init_lon + width, init_lat + height),
                    (init_lon, init_lat + height),
                ),
                [],
            )
        ]
    )

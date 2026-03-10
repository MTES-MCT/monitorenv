def normalize_gdf(gdf):
    return (
        gdf
        .convert_dtypes()
        .sort_index(axis=1)
        .reset_index(drop=True)
    )
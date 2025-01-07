ARG PG_MAJOR
ARG POSTGIS_VERSION

FROM postgres:"$PG_MAJOR"-bookworm
ARG PG_MAJOR
ARG POSTGIS_VERSION

RUN sed -i 's/apt/apt-archive/' /etc/apt/sources.list.d/pgdg.list
RUN sed -i 's/pgdg/pgdg-archive/' /etc/apt/sources.list.d/pgdg.list

# Install PostGIS extension
RUN \
    POSTGIS_MAJOR=$(echo "$POSTGIS_VERSION" | cut -c1) && \
    apt update && \
    apt install -y --no-install-recommends \
        postgresql-"$PG_MAJOR"-postgis-"$POSTGIS_MAJOR"="$POSTGIS_VERSION"* \
        postgresql-"$PG_MAJOR"-postgis-"$POSTGIS_MAJOR"-scripts  && \
    rm -rf /var/lib/apt/lists/*
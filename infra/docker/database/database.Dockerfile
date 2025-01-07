ARG PG_MAJOR
ARG POSTGIS_VERSION

FROM postgres:"$PG_MAJOR"-bookworm
ARG PG_MAJOR
ARG POSTGIS_VERSION

RUN apt-get update
RUN apt-get install -y --no-install-recommends wget ca-certificates
RUN wget -O - http://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc | apt-key add -

RUN sed -i 's/ "$PG_MAJOR"//' /etc/apt/sources.list.d/pgdg.list
RUN sed -i 's/apt/apt-archive/' /etc/apt/sources.list.d/pgdg.list
RUN sed -i 's/pgdg/pgdg-archive/' /etc/apt/sources.list.d/pgdg.list

# Install PostGIS extension
RUN \
    POSTGIS_MAJOR=$(echo "$POSTGIS_VERSION" | cut -c1) && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        postgresql-"$PG_MAJOR"-postgis-"$POSTGIS_MAJOR"="$POSTGIS_VERSION"* \
        postgresql-"$PG_MAJOR"-postgis-"$POSTGIS_MAJOR"-scripts  && \
    rm -rf /var/lib/apt/lists/*
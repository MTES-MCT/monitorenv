ARG FROM_PG_MAJOR
ARG TO_PG_MAJOR
ARG POSTGIS_VERSION

FROM postgres:$TO_PG_MAJOR-bookworm
ARG FROM_PG_MAJOR
ARG TO_PG_MAJOR
ARG POSTGIS_VERSION

RUN sed -i 's/apt/apt-archive/' /etc/apt/sources.list.d/pgdg.list
RUN sed -i 's/pgdg/pgdg-archive/' /etc/apt/sources.list.d/pgdg.list

RUN set -eux; \
	apt-get update; \
	apt-get install -y --no-install-recommends \
		postgresql-$FROM_PG_MAJOR \
	; \
	rm -rf /var/lib/apt/lists/*

ENV PGBINOLD /usr/lib/postgresql/$FROM_PG_MAJOR/bin
ENV PGBINNEW /usr/lib/postgresql/$TO_PG_MAJOR/bin

ENV PGDATAOLD /var/lib/postgresql/$FROM_PG_MAJOR/data
ENV PGDATANEW /var/lib/postgresql/$TO_PG_MAJOR/data

RUN set -eux; \
	mkdir -p "$PGDATAOLD" "$PGDATANEW"; \
	chown -R postgres:postgres /var/lib/postgresql

WORKDIR /var/lib/postgresql

COPY infra/docker/database/docker-upgrade /usr/local/bin/

ENTRYPOINT ["docker-upgrade"]

# recommended: --link
CMD ["pg_upgrade"]

# Install PostGIS extension in both versions of Postgres
RUN apt update
RUN \
    POSTGIS_MAJOR=$(echo $POSTGIS_VERSION | cut -c1) && \
    apt install -y --no-install-recommends \
        postgresql-$FROM_PG_MAJOR-postgis-$POSTGIS_MAJOR=$POSTGIS_VERSION* \
        postgresql-$FROM_PG_MAJOR-postgis-$POSTGIS_MAJOR-scripts \
        postgresql-$TO_PG_MAJOR-postgis-$POSTGIS_MAJOR=$POSTGIS_VERSION* \
        postgresql-$TO_PG_MAJOR-postgis-$POSTGIS_MAJOR-scripts \
    && rm -rf /var/lib/apt/lists/*
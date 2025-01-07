FROM timescale/timescaledb-postgis:1.7.4-pg11

RUN set -ex && \
    apk add --no-cache --virtual .build-deps \
        gdal-dev \
        protobuf-c-dev \
        proj-dev \
        geos-dev \
        libxml2-dev \
        perl \
        llvm \
        clang \
        clang-dev \
        build-base && \
    cd /tmp && \
    wget https://download.osgeo.org/postgis/source/postgis-3.3.2.tar.gz -O - | tar -xz && \
    cd postgis-3.3.2 && \
    ./configure && \
    make -s && \
    make -s install && \
    apk add --no-cache --virtual .postgis-rundeps \
        json-c \
        geos \
        gdal \
        proj \
        protobuf-c \
        libstdc++  && \
    cd / && \
    rm -rf /tmp/postgis-3.3.2 && \
    apk del .build-deps;

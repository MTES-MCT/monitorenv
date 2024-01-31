#!/bin/sh
set -eu

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "transversal_sea_limit_areas",
    "nativeName": "transversal_sea_limit_areas",
    "title": "transversal_sea_limit_areas",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "saltwater_limit_areas",
    "nativeName": "saltwater_limit_areas",
    "title": "saltwater_limit_areas",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF
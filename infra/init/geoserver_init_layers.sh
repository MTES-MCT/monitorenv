#!/bin/sh
set -eu

curl -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces -H  "accept: text/html" -H  "content-type: application/json" \
-d "{ \"workspace\": {\"name\": \"monitorenv\"}}"

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "dataStore": {
    "name": "monitorenv_postgis",
    "connectionParameters": {
      "entry": [
        {"@key":"host","$":"$GEOSERVER_DB_HOST"},
        {"@key":"port","$":"$POSTGRES_PORT"},
        {"@key":"database","$":"$POSTGRES_DB"},
        {"@key":"schema","$":"$POSTGRES_SCHEMA"},
        {"@key":"user","$":"$POSTGRES_USER"},
        {"@key":"passwd","$":"$POSTGRES_PASSWORD"},
        {"@key":"dbtype","$":"postgis"},
        {"@key":"Expose primary keys","$":"true"}
      ]
    }
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "eez_areas",
    "nativeName": "eez_areas",
    "title": "EEZ",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "fao_areas",
    "nativeName": "fao_areas",
    "title": "FAO",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "3_miles_areas",
    "nativeName": "3_miles_areas",
    "title": "3 Miles",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "6_miles_areas",
    "nativeName": "6_miles_areas",
    "title": "6 Miles",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "12_miles_areas",
    "nativeName": "12_miles_areas",
    "title": "12 Miles",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF



curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "fao_ccamlr_areas",
    "nativeName": "fao_ccamlr_areas",
    "title": "fao CCAMLR areas",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "fao_iccat_areas",
    "nativeName": "fao_iccat_areas",
    "title": "fao ICCAT areas",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "fao_iotc_areas",
    "nativeName": "fao_iotc_areas",
    "title": "fao IOTC areas",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "fao_neafc_areas",
    "nativeName": "fao_neafc_areas",
    "title": "fao NEAFC areas",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "fao_siofa_areas",
    "nativeName": "fao_siofa_areas",
    "title": "fao SIOFA areas",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF



curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "aem_areas",
    "nativeName": "aem_areas",
    "title": "AEM areas",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF


curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "environment_regulatory_areas",
    "nativeName": "regulations_cacem",
    "title": "Environment Regulatory Areas",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF


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

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "straight_baseline",
    "nativeName": "straight_baseline",
    "title": "straight_baseline",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "low_water_line",
    "nativeName": "low_water_line",
    "title": "low_water_line",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "low_water_line",
    "nativeName": "low_water_line",
    "title": "low_water_line",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "territorial_seas",
    "nativeName": "territorial_seas",
    "title": "territorial_seas",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "departments_areas",
    "nativeName": "departments_areas",
    "title": "departments_areas",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "facade_areas_subdivided",
    "nativeName": "facade_areas_subdivided",
    "title": "facade_areas_subdivided",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF


curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "facade_areas_unextended",
    "nativeName": "facade_areas_unextended",
    "title": "facade_areas_unextended",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF


curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "marpol",
    "nativeName": "marpol",
    "title": "marpol",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "competence_cross_areas",
    "nativeName": "competence_cross_areas",
    "title": "competence_cross_areas",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "three_hundred_meters_areas",
    "nativeName": "three_hundred_meters_areas",
    "title": "three_hundred_meters_areas",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "marine_cultures_85",
    "nativeName": "marine_cultures_85",
    "title": "marine_cultures_85",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "gulf_of_lion_marine_park",
    "nativeName": "gulf_of_lion_marine_park",
    "title": "gulf_of_lion_marine_park",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF


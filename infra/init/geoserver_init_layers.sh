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
        {"@key":"user","$":"$POSTGRES_PASSWORD"},
        {"@key":"passwd","$":"$POSTGRES_USER"},
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
    "name": "1241_eaux_occidentales_australes_areas",
    "nativeName": "1241_eaux_occidentales_australes_areas",
    "title": "1241 eaux occidentales australes areas",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "1241_eaux_occidentales_septentrionales_areas",
    "nativeName": "1241_eaux_occidentales_septentrionales_areas",
    "title": "1241 eaux occidentales septentrionales areas",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "1241_eaux_union_dans_oi_et_atl_ouest_areas",
    "nativeName": "1241_eaux_union_dans_oi_et_atl_ouest_areas",
    "title": "1241 eaux union dans oi et atl ouest areas",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "1241_mer_baltique_areas",
    "nativeName": "1241_mer_baltique_areas",
    "title": "1241 mer baltique",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "1241_mer_du_nord_areas",
    "nativeName": "1241_mer_du_nord_areas",
    "title": "1241 mer du nord",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "1241_mer_mediterranee_areas",
    "nativeName": "1241_mer_mediterranee_areas",
    "title": "1241 mer mediterranee",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "1241_mer_noire_areas",
    "nativeName": "1241_mer_noire_areas",
    "title": "1241 mer noire areas",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "cormoran_areas",
    "nativeName": "cormoran_areas",
    "title": "cormoran areas",
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
    "name": "rectangles_stat_areas",
    "nativeName": "rectangles_stat_areas",
    "title": "rectangles stat areas",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "situs_areas",
    "nativeName": "situs_areas",
    "title": "situation VMS",
    "nativeCRS": "EPSG:4326",
    "srs": "EPSG:4326",
    "enabled": true,
  }
}
EOF

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} -X POST http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes -H  "accept: text/html" -H  "content-type: application/json" -d @- << EOF
{
  "featureType": {
    "name": "brexit_areas",
    "nativeName": "brexit_areas",
    "title": "Brexit",
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
    "name": "cgpm_areas",
    "nativeName": "cgpm_areas",
    "title": "cgpm_areas",
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

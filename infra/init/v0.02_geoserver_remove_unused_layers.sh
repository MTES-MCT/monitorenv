#!/bin/sh
set -eu

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} \
  -X DELETE http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes/1241_eaux_occidentales_australes_areas?recurse=true \
  -H  "accept: text/html" -H  "content-type: application/json"

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} \
  -X DELETE http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes/1241_eaux_occidentales_septentrionales_areas?recurse=true \
  -H  "accept: text/html" -H  "content-type: application/json"

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} \
  -X DELETE http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes/1241_eaux_union_dans_oi_et_atl_ouest_areas?recurse=true \
  -H  "accept: text/html" -H  "content-type: application/json"

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} \
  -X DELETE http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes/1241_mer_baltique_areas?recurse=true \
  -H  "accept: text/html" -H  "content-type: application/json"

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} \
  -X DELETE http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes/1241_mer_du_nord_areas?recurse=true \
  -H  "accept: text/html" -H  "content-type: application/json"

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} \
  -X DELETE http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes/1241_mer_mediterranee_areas?recurse=true \
  -H  "accept: text/html" -H  "content-type: application/json"

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} \
  -X DELETE http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes/1241_mer_noire_areas?recurse=true \
  -H  "accept: text/html" -H  "content-type: application/json"

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} \
  -X DELETE http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes/cormoran_areas?recurse=true \
  -H  "accept: text/html" -H  "content-type: application/json"

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} \
  -X DELETE http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes/rectangles_stat_areas?recurse=true \
  -H  "accept: text/html" -H  "content-type: application/json"

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} \
  -X DELETE http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes/situs_areas?recurse=true \
  -H  "accept: text/html" -H  "content-type: application/json"

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} \
  -X DELETE http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes/brexit_areas?recurse=true \
  -H  "accept: text/html" -H  "content-type: application/json"

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} \
  -X DELETE http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes/fao_iccat_areas?recurse=true \
  -H  "accept: text/html" -H  "content-type: application/json"
  
curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} \
  -X DELETE http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes/fao_iotc_areas?recurse=true \
  -H  "accept: text/html" -H  "content-type: application/json"

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} \
  -X DELETE http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes/fao_siofa_areas?recurse=true \
  -H  "accept: text/html" -H  "content-type: application/json"

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} \
  -X DELETE http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes/fao_ccamlr_areas?recurse=true \
  -H  "accept: text/html" -H  "content-type: application/json"

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} \
  -X DELETE http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes/fao_neafc_areas?recurse=true \
  -H  "accept: text/html" -H  "content-type: application/json"

curl -v -u ${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD} \
  -X DELETE http://${GEOSERVER_HOST}:${GEOSERVER_PORT}/geoserver/rest/workspaces/monitorenv/datastores/monitorenv_postgis/featuretypes/cgpm_areas?recurse=true \
  -H  "accept: text/html" -H  "content-type: application/json"

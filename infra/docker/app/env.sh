#!/bin/bash

sed -i 's#__REACT_APP_GEOSERVER_LOCAL_URL__#'"$REACT_APP_GEOSERVER_LOCAL_URL"'#g' /home/monitorenv/public/env.js
sed -i 's#__REACT_APP_GEOSERVER_REMOTE_URL__#'"$REACT_APP_GEOSERVER_REMOTE_URL"'#g' /home/monitorenv/public/env.js
sed -i 's#__REACT_APP_GEOSERVER_NAMESPACE__#'"$REACT_APP_GEOSERVER_NAMESPACE"'#g' /home/monitorenv/public/env.js
sed -i 's#__REACT_APP_MAPBOX_KEY__#'"$REACT_APP_MAPBOX_KEY"'#g' /home/monitorenv/public/env.js
sed -i 's#__REACT_APP_SHOM_KEY__#'"$REACT_APP_SHOM_KEY"'#g' /home/monitorenv/public/env.js
sed -i 's#__REACT_APP_CYPRESS_TEST__#'"$REACT_APP_CYPRESS_TEST"'#g' /home/monitorenv/public/env.js

exec "$@"

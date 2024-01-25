#!/bin/bash

sed -i 's#__REACT_APP_MONITORENV_VERSION__#'"$REACT_APP_MONITORENV_VERSION"'#g' /home/monitorenv/public/env.js
sed -i 's#__REACT_APP_GEOSERVER_REMOTE_URL__#'"$REACT_APP_GEOSERVER_REMOTE_URL"'#g' /home/monitorenv/public/env.js
sed -i 's#__REACT_APP_GEOSERVER_NAMESPACE__#'"$REACT_APP_GEOSERVER_NAMESPACE"'#g' /home/monitorenv/public/env.js
sed -i 's#__REACT_APP_GOOGLEMAPS_API_KEY__#'"$REACT_APP_GOOGLEMAPS_API_KEY"'#g' /home/monitorenv/public/env.js
sed -i 's#__REACT_APP_MAPBOX_KEY__#'"$REACT_APP_MAPBOX_KEY"'#g' /home/monitorenv/public/env.js
sed -i 's#__REACT_APP_SENTRY_DSN__#'"$SENTRY_DSN"'#g' /home/monitorenv/public/env.js
sed -i 's#__REACT_APP_SENTRY_ENV__#'"$REACT_APP_SENTRY_ENV"'#g' /home/monitorenv/public/env.js
sed -i 's#__REACT_APP_SENTRY_TRACING_ORIGINS__#'"$REACT_APP_SENTRY_TRACING_ORIGINS"'#g' /home/monitorenv/public/env.js
sed -i 's#__REACT_APP_SHOM_KEY__#'"$REACT_APP_SHOM_KEY"'#g' /home/monitorenv/public/env.js
sed -i 's#__REACT_APP_CYPRESS_TEST__#'"$REACT_APP_CYPRESS_TEST"'#g' /home/monitorenv/public/env.js
sed -i 's#__REACT_APP_MISSION_FORM_AUTO_UPDATE__#'"$REACT_APP_MISSION_FORM_AUTO_UPDATE"'#g' /home/monitorenv/public/env.js
sed -i 's#__REACT_APP_MISSION_FORM_AUTO_SAVE_ENABLED__#'"$REACT_APP_MISSION_FORM_AUTO_SAVE_ENABLED"'#g' /home/monitorenv/public/env.js

exec "$@"

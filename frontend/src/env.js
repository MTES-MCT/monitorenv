/**
 * Env variables overridables on runtime
 */

export const GEOSERVER_REMOTE_URL = self?.env?.REACT_APP_GEOSERVER_REMOTE_URL !== '__REACT_APP_GEOSERVER_REMOTE_URL__'
  ? self.env.REACT_APP_GEOSERVER_REMOTE_URL
  : process.env.REACT_APP_GEOSERVER_REMOTE_URL

export const GEOSERVER_NAMESPACE = self?.env?.REACT_APP_GEOSERVER_NAMESPACE !== '__REACT_APP_GEOSERVER_NAMESPACE__'
? self.env.REACT_APP_GEOSERVER_NAMESPACE
: process.env.REACT_APP_GEOSERVER_NAMESPACE

export const CYPRESS_TEST = self?.env?.REACT_APP_CYPRESS_TEST !== '__REACT_APP_CYPRESS_TEST__'
? self.env.REACT_APP_CYPRESS_TEST
: process.env.REACT_APP_CYPRESS_TEST

export const MAPBOX_KEY = self?.env?.REACT_APP_MAPBOX_KEY !== '__REACT_APP_MAPBOX_KEY__'
? self.env.REACT_APP_MAPBOX_KEY
: process.env.REACT_APP_MAPBOX_KEY

export const SHOM_KEY = self?.env?.REACT_APP_SHOM_KEY !== '__REACT_APP_SHOM_KEY__'
? self.env.REACT_APP_SHOM_KEY
: process.env.REACT_APP_SHOM_KEY

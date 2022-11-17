// @ts-nocheck
/* eslint-disable no-restricted-globals */

/**
 * Env variables overridables on runtime
 */

export const GEOSERVER_REMOTE_URL =
  self?.env?.REACT_APP_GEOSERVER_REMOTE_URL !== '__REACT_APP_GEOSERVER_REMOTE_URL__'
    ? self.env.REACT_APP_GEOSERVER_REMOTE_URL
    : process.env.REACT_APP_GEOSERVER_REMOTE_URL

export const GEOSERVER_NAMESPACE =
  self?.env?.REACT_APP_GEOSERVER_NAMESPACE !== '__REACT_APP_GEOSERVER_NAMESPACE__'
    ? self.env.REACT_APP_GEOSERVER_NAMESPACE
    : process.env.REACT_APP_GEOSERVER_NAMESPACE

export const MAPBOX_KEY =
  self?.env?.REACT_APP_MAPBOX_KEY !== '__REACT_APP_MAPBOX_KEY__'
    ? self.env.REACT_APP_MAPBOX_KEY
    : process.env.REACT_APP_MAPBOX_KEY

export const SHOM_KEY =
  self?.env?.REACT_APP_SHOM_KEY !== '__REACT_APP_SHOM_KEY__'
    ? self.env.REACT_APP_SHOM_KEY
    : process.env.REACT_APP_SHOM_KEY

export const SENTRY_ENV =
  self?.env?.REACT_APP_SENTRY_ENV !== '__REACT_APP_SENTRY_ENV__'
    ? self.env.REACT_APP_SENTRY_ENV
    : process.env.REACT_APP_SENTRY_ENV

export const SENTRY_DSN =
  self?.env?.REACT_APP_SENTRY_DSN !== '__REACT_APP_SENTRY_DSN__'
    ? self.env.REACT_APP_SENTRY_DSN
    : process.env.REACT_APP_SENTRY_DSN

export const SENTRY_TRACING_ORIGINS =
  self?.env?.REACT_APP_SENTRY_TRACING_ORIGINS !== '__REACT_APP_SENTRY_TRACING_ORIGINS__'
    ? self.env.REACT_APP_SENTRY_TRACING_ORIGINS
    : process.env.REACT_APP_SENTRY_TRACING_ORIGINS

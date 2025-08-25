import { WSG84_PROJECTION } from '@mtes-mct/monitor-ui'

const OK = 200

export function throwIrretrievableBeachesError(e) {
  throw Error(`Nous n'avons pas pu récupérer les plages: ${e}`)
}

export const getBeachesFromAPI = async () => {
  const geoserverURL = import.meta.env.FRONTEND_GEOSERVER_REMOTE_URL

  return fetch(
    `${geoserverURL}/geoserver/wfs?service=WFS&` +
      `version=1.1.0&request=GetFeature&typename=${
        import.meta.env.FRONTEND_GEOSERVER_NAMESPACE
      }:beaches&outputFormat=application/json&srsname=${WSG84_PROJECTION}`
  )
    .then(response => {
      if (response.status === OK) {
        return response
          .json()
          .then(r => r.features)
          .catch(e => {
            throwIrretrievableBeachesError(e)
          })
      }

      return response.text().then(responseText => {
        throwIrretrievableBeachesError(responseText)
      })
    })
    .catch(e => {
      throwIrretrievableBeachesError(e)
    })
}

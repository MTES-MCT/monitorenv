import { WSG84_PROJECTION } from '@mtes-mct/monitor-ui'

const OK = 200

export function throwIrretrievableBeachesError(e) {
  throw Error(`Nous n'avons pas pu récupérer les plages: ${e}`)
}

function sanitizeQuery(query: string) {
  return query.replace(/'/g, "''")
}

export const getBeachesFromAPI = async (query: string | undefined) => {
  const geoserverURL = import.meta.env.FRONTEND_GEOSERVER_REMOTE_URL

  if (!query) {
    return Promise.resolve([])
  }

  const searchQueries = query
    .trim()
    .split(/[\s,.\-;:()]+/)
    .filter(t => t.length > 0)

  const conditions = searchQueries.map(searchQuery => {
    const sanitizedQuery = sanitizeQuery(searchQuery)

    return `(name ILIKE '%${sanitizedQuery}%' OR official_name ILIKE '%${sanitizedQuery}%' OR postcode ILIKE '%${sanitizedQuery}%')`
  })
  const cqlFilter = conditions.join(' AND ')

  return fetch(
    `${geoserverURL}/geoserver/wfs?service=WFS&` +
      `version=1.1.0&request=GetFeature&typename=${
        import.meta.env.FRONTEND_GEOSERVER_NAMESPACE
      }:beaches&outputFormat=application/json&srsname=${WSG84_PROJECTION}&CQL_FILTER=${encodeURIComponent(cqlFilter)}`
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

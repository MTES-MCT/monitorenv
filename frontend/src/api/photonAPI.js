import { useEffect, useState } from 'react'

const PHOTON_API_URL = 'https://photon.komoot.io/api/'

export const usePhotonAPI = (search, { lang = 'fr', latlon = undefined, limit = 20 } = {}) => {
  const [results, setResults] = useState(undefined)

  useEffect(() => {
    if (search) {
      let searchParams = {
        lang,
        limit,
        q: search
      }
      if (latlon) {
        searchParams = { ...searchParams, lat: latlon[0], lon: latlon[1] }
      }
      // @ts-ignore
      // see https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
      // URLSearchParams() constructor accepts "a record of string keys and string values."
      const query = new URLSearchParams(searchParams)
      const queryURL = `${PHOTON_API_URL}?${query.toString()}`
      fetch(queryURL)
        .then(response => response.json())
        .then(data => {
          setResults(data?.features)
        })
    } else {
      setResults(undefined)
    }
  }, [search, lang, latlon, limit])

  return results
}

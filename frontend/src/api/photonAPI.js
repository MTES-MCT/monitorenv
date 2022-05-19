import { useEffect, useState } from "react"

const PHOTON_API_URL = 'https://photon.komoot.io/api/'

export const usePhotonAPI = (search, {limit = 20, lang = 'fr', latlon} = {}) => {
  const [results, setResults] = useState(null)

  useEffect(()=> {
    if (search) {
      let searchParams = {
        q: search,
        limit,
        lang,
      }
      if (latlon) {
        searchParams = { ...searchParams, lat: latlon[0], lon: latlon[1]}
      }
      const query = new URLSearchParams(searchParams)
      const queryURL = `${PHOTON_API_URL}?${query.toString()}`
      fetch(queryURL).then(response=>response.json()).then(data=> {
        setResults(data?.features)
      })

    } else {
      setResults(null)
    }
  }, [search])


  return results
}
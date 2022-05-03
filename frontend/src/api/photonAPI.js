import { useEffect, useState } from "react"

const PHOTON_API_URL = 'https://photon.komoot.io/api/'

export const usePhotonAPI = (search, {limit = 10, lang = 'fr'} = {}) => {
  const [results, setResults] = useState(null)

  useEffect(()=> {
    if (search) {
      const query = new URLSearchParams({
        q: search,
        limit,
        lang,
      })
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